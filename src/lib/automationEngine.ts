// Core Automation Engine for InnoSpot Platform
// Handles workflow execution, scheduling, monitoring, and management

import { supabase } from './supabase';
import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowNode,
  NodeExecution,
  WorkflowSchedule,
  ExecutionLogEntry,
  WorkflowStatus,
  AutomationAnalytics,
} from '../types/automation';

/**
 * Core automation engine class that manages workflow lifecycle
 * Provides centralized execution, scheduling, and monitoring capabilities
 */
export class AutomationEngine {
  private static instance: AutomationEngine;
  private executionQueue: Map<string, WorkflowExecution> = new Map();
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  private constructor() {
    this.startEngine();
  }

  /**
   * Singleton instance getter
   */
  public static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  /**
   * Start the automation engine
   */
  public startEngine(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.loadScheduledWorkflows();
    this.startExecutionLoop();
    
    console.log('🤖 InnoSpot Automation Engine started');
  }

  /**
   * Stop the automation engine
   */
  public stopEngine(): void {
    this.isRunning = false;
    
    // Clear all scheduled jobs
    this.scheduledJobs.forEach((timeout) => clearTimeout(timeout));
    this.scheduledJobs.clear();
    
    // Cancel pending executions
    this.executionQueue.clear();
    
    console.log('🛑 InnoSpot Automation Engine stopped');
  }

  // ==================== WORKFLOW MANAGEMENT ====================

  /**
   * Create a new workflow from template or scratch
   */
  public async createWorkflow(
    workflow: Omit<WorkflowDefinition, 'id' | 'created_at' | 'updated_at' | 'execution_count' | 'success_count' | 'failure_count'>
  ): Promise<WorkflowDefinition> {
    try {
      const newWorkflow: WorkflowDefinition = {
        ...workflow,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        execution_count: 0,
        success_count: 0,
        failure_count: 0,
      };

      const { data, error } = await supabase
        .from('automation_workflows')
        .insert([newWorkflow])
        .select()
        .single();

      if (error) throw error;

      // Schedule workflow if it has a schedule
      if (newWorkflow.schedule?.enabled) {
        await this.scheduleWorkflow(newWorkflow);
      }

      return data;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  /**
   * Update an existing workflow
   */
  public async updateWorkflow(
    workflowId: string, 
    updates: Partial<WorkflowDefinition>
  ): Promise<WorkflowDefinition> {
    try {
      const { data, error } = await supabase
        .from('automation_workflows')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) throw error;

      // Update scheduling if needed
      if (updates.schedule !== undefined) {
        await this.updateWorkflowSchedule(workflowId, updates.schedule);
      }

      return data;
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw error;
    }
  }

  /**
   * Delete a workflow and its executions
   */
  public async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      // Remove from schedule
      this.unscheduleWorkflow(workflowId);

      // Delete workflow and related data
      const { error } = await supabase
        .from('automation_workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      console.log(`Workflow ${workflowId} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow by ID
   */
  public async getWorkflow(workflowId: string): Promise<WorkflowDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get workflow:', error);
      return null;
    }
  }

  /**
   * List workflows with filtering and pagination
   */
  public async listWorkflows(
    filters: {
      status?: WorkflowStatus;
      owner_id?: string;
      project_id?: string;
      scope?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<WorkflowDefinition[]> {
    try {
      let query = supabase
        .from('automation_workflows')
        .select('*');

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id);
      }
      if (filters.scope) {
        query = query.eq('scope', filters.scope);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to list workflows:', error);
      return [];
    }
  }

  // ==================== WORKFLOW EXECUTION ====================

  /**
   * Execute a workflow manually
   */
  public async executeWorkflow(
    workflowId: string,
    inputData: Record<string, any> = {},
    triggeredBy: string = 'manual'
  ): Promise<WorkflowExecution> {
    try {
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      if (workflow.status !== 'active') {
        throw new Error(`Workflow ${workflowId} is not active`);
      }

      const execution: WorkflowExecution = {
        id: this.generateId(),
        workflow_id: workflowId,
        status: 'pending',
        trigger_type: 'manual',
        triggered_by: triggeredBy,
        started_at: new Date().toISOString(),
        input_data: inputData,
        node_executions: [],
        execution_log: [],
        resource_usage: {
          cpu_usage: 0,
          memory_usage: 0,
          execution_time: 0,
          api_calls: 0,
          storage_used: 0,
        },
      };

      // Save execution to database
      await this.saveExecution(execution);

      // Add to execution queue
      this.executionQueue.set(execution.id, execution);

      this.logExecution(execution, 'info', `Workflow execution started by ${triggeredBy}`);

      return execution;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  }

  /**
   * Cancel a running execution
   */
  public async cancelExecution(executionId: string): Promise<void> {
    try {
      const execution = this.executionQueue.get(executionId);
      if (execution) {
        execution.status = 'cancelled';
        execution.completed_at = new Date().toISOString();
        
        await this.saveExecution(execution);
        this.executionQueue.delete(executionId);
        
        this.logExecution(execution, 'info', 'Execution cancelled by user');
      }
    } catch (error) {
      console.error('Failed to cancel execution:', error);
      throw error;
    }
  }

  /**
   * Get execution details
   */
  public async getExecution(executionId: string): Promise<WorkflowExecution | null> {
    try {
      const { data, error } = await supabase
        .from('automation_executions')
        .select('*')
        .eq('id', executionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get execution:', error);
      return null;
    }
  }

  /**
   * List executions for a workflow
   */
  public async listExecutions(
    workflowId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<WorkflowExecution[]> {
    try {
      const { data, error } = await supabase
        .from('automation_executions')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to list executions:', error);
      return [];
    }
  }

  // ==================== WORKFLOW SCHEDULING ====================

  /**
   * Schedule a workflow based on its schedule configuration
   */
  private async scheduleWorkflow(workflow: WorkflowDefinition): Promise<void> {
    if (!workflow.schedule?.enabled) return;

    // Clear existing schedule
    this.unscheduleWorkflow(workflow.id);

    const { schedule } = workflow;
    
    try {
      if (schedule.cron_expression) {
        // Handle cron-based scheduling
        await this.scheduleCronWorkflow(workflow, schedule.cron_expression);
      } else if (schedule.interval) {
        // Handle interval-based scheduling
        await this.scheduleIntervalWorkflow(workflow, schedule.interval);
      }

      console.log(`Scheduled workflow ${workflow.name} (${workflow.id})`);
    } catch (error) {
      console.error(`Failed to schedule workflow ${workflow.id}:`, error);
    }
  }

  /**
   * Schedule workflow using cron expression
   */
  private async scheduleCronWorkflow(workflow: WorkflowDefinition, cronExpression: string): Promise<void> {
    // Note: In a production environment, you would use a proper cron library
    // For now, we'll implement basic interval scheduling
    const nextExecution = this.getNextCronExecution(cronExpression);
    const delay = nextExecution.getTime() - Date.now();

    if (delay > 0) {
      const timeout = setTimeout(async () => {
        await this.executeWorkflow(workflow.id, {}, 'scheduled');
        // Reschedule for next execution
        await this.scheduleWorkflow(workflow);
      }, delay);

      this.scheduledJobs.set(workflow.id, timeout);
    }
  }

  /**
   * Schedule workflow using interval
   */
  private async scheduleIntervalWorkflow(
    workflow: WorkflowDefinition,
    interval: { value: number; unit: string }
  ): Promise<void> {
    const intervalMs = this.convertIntervalToMs(interval.value, interval.unit);

    const timeout = setTimeout(async () => {
      await this.executeWorkflow(workflow.id, {}, 'scheduled');
      // Reschedule for next execution
      await this.scheduleWorkflow(workflow);
    }, intervalMs);

    this.scheduledJobs.set(workflow.id, timeout);
  }

  /**
   * Remove workflow from schedule
   */
  private unscheduleWorkflow(workflowId: string): void {
    const timeout = this.scheduledJobs.get(workflowId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledJobs.delete(workflowId);
    }
  }

  /**
   * Update workflow schedule
   */
  private async updateWorkflowSchedule(
    workflowId: string, 
    schedule?: WorkflowSchedule
  ): Promise<void> {
    const workflow = await this.getWorkflow(workflowId);
    if (workflow) {
      workflow.schedule = schedule;
      if (schedule?.enabled) {
        await this.scheduleWorkflow(workflow);
      } else {
        this.unscheduleWorkflow(workflowId);
      }
    }
  }

  // ==================== NODE EXECUTION ====================

  /**
   * Execute a workflow node
   */
  private async executeNode(
    execution: WorkflowExecution,
    node: WorkflowNode,
    inputData: Record<string, any>
  ): Promise<NodeExecution> {
    const nodeExecution: NodeExecution = {
      node_id: node.id,
      status: 'running',
      started_at: new Date().toISOString(),
      input_data: inputData,
      retry_count: 0,
    };

    try {
      this.logExecution(execution, 'info', `Executing node: ${node.name}`);

      // Execute based on node type
      const result = await this.executeNodeByType(node, inputData);

      nodeExecution.status = 'completed';
      nodeExecution.completed_at = new Date().toISOString();
      nodeExecution.output_data = result;
      nodeExecution.duration = 
        new Date(nodeExecution.completed_at).getTime() - 
        new Date(nodeExecution.started_at!).getTime();

      this.logExecution(execution, 'info', `Node ${node.name} completed successfully`);

    } catch (error) {
      nodeExecution.status = 'failed';
      nodeExecution.completed_at = new Date().toISOString();
      nodeExecution.error_message = error instanceof Error ? error.message : String(error);
      
      this.logExecution(execution, 'error', `Node ${node.name} failed: ${nodeExecution.error_message}`);

      // Handle retry logic
      if (nodeExecution.retry_count < 3 && !node.continue_on_error) {
        nodeExecution.retry_count++;
        nodeExecution.status = 'running';
        return await this.executeNode(execution, node, inputData);
      }

      if (!node.continue_on_error) {
        throw error;
      }
    }

    return nodeExecution;
  }

  /**
   * Execute node based on its type
   */
  private async executeNodeByType(
    node: WorkflowNode, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    switch (node.type) {
      case 'trigger':
        return await this.executeTriggerNode(node, inputData);
      
      case 'condition':
        return await this.executeConditionNode(node, inputData);
      
      case 'action':
        return await this.executeActionNode(node, inputData);
      
      case 'delay':
        return await this.executeDelayNode(node, inputData);
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Execute trigger node
   */
  private async executeTriggerNode(
    _node: WorkflowNode, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    // Trigger nodes typically just pass data through
    return { ...inputData,_triggered_at: new Date().toISOString() };
  }

  /**
   * Execute condition node
   */
  private async executeConditionNode(
    node: WorkflowNode, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    const { condition, true_output, false_output } = node.config;
    
    // Evaluate condition (simplified implementation)
    const result = this.evaluateCondition(condition, inputData);
    
    return {
      condition_result: result,
      output: result ? true_output : false_output,
      ...inputData,
    };
  }

  /**
   * Execute action node
   */
  private async executeActionNode(
    node: WorkflowNode, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    const { action_type, parameters } = node.config;
    
    switch (action_type) {
      case 'send_email':
        return await this.sendEmailAction(parameters, inputData);
      
      case 'create_alert':
        return await this.createAlertAction(parameters, inputData);
      
      case 'update_database':
        return await this.updateDatabaseAction(parameters, inputData);
      
      case 'call_webhook':
        return await this.callWebhookAction(parameters, inputData);
      
      default:
        throw new Error(`Unknown action type: ${action_type}`);
    }
  }

  /**
   * Execute delay node
   */
  private async executeDelayNode(
    node: WorkflowNode, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    const { delay_seconds } = node.config;
    
    await new Promise(resolve => setTimeout(resolve, delay_seconds * 1000));
    
    return { ...inputData,_delayed_at: new Date().toISOString() };
  }

  // ==================== ACTION IMPLEMENTATIONS ====================

  /**
   * Send email action
   */
  private async sendEmailAction(
    parameters: Record<string, any>, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    // Implementation would integrate with email service
    console.log('Sending email:', parameters, inputData);
    return { email_sent: true,_sent_at: new Date().toISOString() };
  }

  /**
   * Create alert action
   */
  private async createAlertAction(
    parameters: Record<string, any>, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    // Implementation would create alert in database
    console.log('Creating alert:', parameters, inputData);
    return { alert_created: true,_alert_id: this.generateId() };
  }

  /**
   * Update database action
   */
  private async updateDatabaseAction(
    parameters: Record<string, any>, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    // Implementation would update database records
    console.log('Updating database:', parameters, inputData);
    return { database_updated: true,_updated_at: new Date().toISOString() };
  }

  /**
   * Call webhook action
   */
  private async callWebhookAction(
    parameters: Record<string, any>, 
    inputData: Record<string, any>
  ): Promise<Record<string, any>> {
    const { url, method = 'POST', headers = {} } = parameters;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(inputData),
      });

      const responseData = await response.json();
      
      return {
        webhook_called: true,
        status_code: response.status,
        response_data: responseData,
      };
    } catch (error) {
      throw new Error(`Webhook call failed: ${error}`);
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Evaluate a condition
   */
  private evaluateCondition(condition: string, data: Record<string, any>): boolean {
    // Simplified condition evaluation
    // In production, you would use a proper expression parser
    try {
      // Replace variables in condition with actual values
      let evaluableCondition = condition;
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        evaluableCondition = evaluableCondition.replace(regex, JSON.stringify(data[key]));
      });
      
      // Use Function constructor for safe evaluation (better than eval)
      return new Function('return ' + evaluableCondition)();
    } catch (error) {
      console.error('Condition evaluation failed:', error);
      return false;
    }
  }

  /**
   * Convert interval to milliseconds
   */
  private convertIntervalToMs(value: number, unit: string): number {
    switch (unit) {
      case 'minutes': return value * 60 * 1000;
      case 'hours': return value * 60 * 60 * 1000;
      case 'days': return value * 24 * 60 * 60 * 1000;
      case 'weeks': return value * 7 * 24 * 60 * 60 * 1000;
      case 'months': return value * 30 * 24 * 60 * 60 * 1000;
      default: return value * 1000; // seconds
    }
  }

  /**
   * Get next cron execution time (simplified)
   */
  private getNextCronExecution(_cronExpression: string): Date {
    // Simplified cron parsing - in production use a proper cron library
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    return nextHour;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log execution event
   */
  private logExecution(
    execution: WorkflowExecution, 
    level: 'debug' | 'info' | 'warning' | 'error', 
    message: string,
    data?: Record<string, any>
  ): void {
    const logEntry: ExecutionLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    execution.execution_log.push(logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`, data);
  }

  /**
   * Save execution to database
   */
  private async saveExecution(execution: WorkflowExecution): Promise<void> {
    try {
      const { error } = await supabase
        .from('automation_executions')
        .upsert([execution]);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save execution:', error);
    }
  }

  /**
   * Load scheduled workflows from database
   */
  private async loadScheduledWorkflows(): Promise<void> {
    try {
      const workflows = await this.listWorkflows({ status: 'active' });
      
      for (const workflow of workflows) {
        if (workflow.schedule?.enabled) {
          await this.scheduleWorkflow(workflow);
        }
      }
      
      console.log(`Loaded ${workflows.length} scheduled workflows`);
    } catch (error) {
      console.error('Failed to load scheduled workflows:', error);
    }
  }

  /**
   * Main execution loop
   */
  private startExecutionLoop(): void {
    setInterval(async () => {
      if (!this.isRunning) return;

      // Process pending executions
      for (const [_executionId, execution] of this.executionQueue) {
        if (execution.status === 'pending') {
          execution.status = 'running';
          await this.processExecution(execution);
        }
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Process a single execution
   */
  private async processExecution(execution: WorkflowExecution): Promise<void> {
    try {
      const workflow = await this.getWorkflow(execution.workflow_id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Execute workflow nodes in sequence
      let currentData = execution.input_data;
      
      for (const node of workflow.nodes) {
        if (!node.enabled) continue;

        const nodeExecution = await this.executeNode(execution, node, currentData);
        execution.node_executions.push(nodeExecution);

        if (nodeExecution.status === 'failed' && !node.continue_on_error) {
          throw new Error(`Node execution failed: ${nodeExecution.error_message}`);
        }

        // Pass output to next node
        if (nodeExecution.output_data) {
          currentData = { ...currentData, ...nodeExecution.output_data };
        }
      }

      // Mark execution as completed
      execution.status = 'completed';
      execution.completed_at = new Date().toISOString();
      execution.output_data = currentData;
      execution.duration = 
        new Date(execution.completed_at).getTime() - 
        new Date(execution.started_at).getTime();

      this.logExecution(execution, 'info', 'Workflow execution completed successfully');

    } catch (error) {
      execution.status = 'failed';
      execution.completed_at = new Date().toISOString();
      execution.error_message = error instanceof Error ? error.message : String(error);
      
      this.logExecution(execution, 'error', `Workflow execution failed: ${execution.error_message}`);
    }

    // Save final execution state
    await this.saveExecution(execution);
    
    // Remove from queue
    this.executionQueue.delete(execution.id);
  }

  // ==================== ANALYTICS ====================

  /**
   * Get workflow analytics
   */
  public async getWorkflowAnalytics(
    workflowId: string,
    startDate: string,
    endDate: string
  ): Promise<AutomationAnalytics> {
    try {
      const { data, error } = await supabase
        .from('automation_executions')
        .select('*')
        .eq('workflow_id', workflowId)
        .gte('started_at', startDate)
        .lte('started_at', endDate);

      if (error) throw error;

      const executions = data || [];
      
      const analytics: AutomationAnalytics = {
        workflow_id: workflowId,
        period: { start_date: startDate, end_date: endDate },
        total_executions: executions.length,
        successful_executions: executions.filter(e => e.status === 'completed').length,
        failed_executions: executions.filter(e => e.status === 'failed').length,
        average_duration: this.calculateAverageDuration(executions),
        throughput: this.calculateThroughput(executions),
        error_rate: this.calculateErrorRate(executions),
        resource_usage: this.aggregateResourceUsage(executions),
        node_performance: [],
        execution_trends: [],
        error_trends: [],
      };

      return analytics;
    } catch (error) {
      console.error('Failed to get workflow analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate average execution duration
   */
  private calculateAverageDuration(executions: WorkflowExecution[]): number {
    const completedExecutions = executions.filter(e => e.duration);
    if (completedExecutions.length === 0) return 0;
    
    const totalDuration = completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0);
    return totalDuration / completedExecutions.length;
  }

  /**
   * Calculate execution throughput
   */
  private calculateThroughput(executions: WorkflowExecution[]): number {
    if (executions.length === 0) return 0;
    
    const timeSpan = this.getTimeSpanHours(executions);
    return timeSpan > 0 ? executions.length / timeSpan : 0;
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(executions: WorkflowExecution[]): number {
    if (executions.length === 0) return 0;
    
    const failedCount = executions.filter(e => e.status === 'failed').length;
    return (failedCount / executions.length) * 100;
  }

  /**
   * Aggregate resource usage
   */
  private aggregateResourceUsage(_executions: WorkflowExecution[]): any {
    // Simplified implementation
    return {
      cpu_usage: 0,
      memory_usage: 0,
      execution_time: 0,
      api_calls: 0,
      storage_used: 0,
    };
  }

  /**
   * Get time span in hours for executions
   */
  private getTimeSpanHours(executions: WorkflowExecution[]): number {
    if (executions.length === 0) return 0;
    
    const startTimes = executions.map(e => new Date(e.started_at).getTime());
    const minTime = Math.min(...startTimes);
    const maxTime = Math.max(...startTimes);
    
    return (maxTime - minTime) / (1000 * 60 * 60); // Convert to hours
  }
}

// Export singleton instance
export const automationEngine = AutomationEngine.getInstance();