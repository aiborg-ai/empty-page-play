#!/usr/bin/env python3
"""
Supabase User Insertion Script
============================

This script allows you to insert new users into the Supabase users table.
It handles both auth.users (authentication) and public.users (profile) records.

Requirements:
    pip install supabase python-dotenv

Usage:
    python insert_user.py
    python insert_user.py --email user@example.com --password password123
    python insert_user.py --interactive
    python insert_user.py --batch users.json
"""

import os
import sys
import json
import argparse
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from getpass import getpass

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing required packages: {e}")
    print("Please install: pip install supabase python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

class SupabaseUserManager:
    def __init__(self):
        """Initialize the Supabase client."""
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
        self.service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError(
                "Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file"
            )
        
        # Use service role key if available for admin operations
        key_to_use = self.service_role_key if self.service_role_key else self.supabase_key
        self.supabase: Client = create_client(self.supabase_url, key_to_use)
        
        print(f"✅ Connected to Supabase: {self.supabase_url}")
        if self.service_role_key:
            print("🔑 Using service role key (admin access)")
        else:
            print("⚠️  Using anon key (limited access)")
    
    def create_auth_user(self, email: str, password: str, user_metadata: Dict[str, Any] = None) -> Optional[str]:
        """
        Create a user in auth.users table.
        Returns the user ID if successful, None otherwise.
        """
        try:
            metadata = user_metadata or {}
            
            # Sign up the user
            response = self.supabase.auth.admin.create_user({
                "email": email,
                "password": password,
                "user_metadata": metadata,
                "email_confirm": True  # Auto-confirm email
            })
            
            if response.user:
                print(f"✅ Auth user created: {response.user.id}")
                return response.user.id
            else:
                print("❌ Failed to create auth user")
                return None
                
        except Exception as e:
            print(f"❌ Error creating auth user: {e}")
            return None
    
    def create_profile_user(self, user_data: Dict[str, Any]) -> bool:
        """
        Create or update a user profile in public.users table.
        """
        try:
            # Ensure required fields
            if 'id' not in user_data or 'email' not in user_data:
                raise ValueError("User data must include 'id' and 'email'")
            
            # Set defaults
            user_record = {
                'id': user_data['id'],
                'email': user_data['email'],
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'display_name': user_data.get('display_name') or f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
                'avatar_url': user_data.get('avatar_url'),
                'role': user_data.get('role', 'user'),
                'account_type': user_data.get('account_type', 'trial'),
                'organization': user_data.get('organization'),
                'bio': user_data.get('bio'),
                'preferences': user_data.get('preferences', {}),
                'subscription_status': user_data.get('subscription_status', 'inactive'),
                'subscription_expires_at': user_data.get('subscription_expires_at'),
                'created_at': datetime.now(timezone.utc).isoformat(),
                'updated_at': datetime.now(timezone.utc).isoformat()
            }
            
            # Remove None values
            user_record = {k: v for k, v in user_record.items() if v is not None}
            
            # Insert or update user profile
            response = self.supabase.table('users').upsert(user_record).execute()
            
            if response.data:
                print(f"✅ Profile user created/updated: {user_record['email']}")
                return True
            else:
                print("❌ Failed to create profile user")
                return False
                
        except Exception as e:
            print(f"❌ Error creating profile user: {e}")
            return False
    
    def create_complete_user(self, user_data: Dict[str, Any]) -> Optional[str]:
        """
        Create both auth user and profile user.
        Returns user ID if successful.
        """
        email = user_data.get('email')
        password = user_data.get('password')
        
        if not email or not password:
            raise ValueError("Email and password are required")
        
        print(f"\n🚀 Creating complete user: {email}")
        
        # Create auth user
        user_metadata = {
            'first_name': user_data.get('first_name'),
            'last_name': user_data.get('last_name'),
            'display_name': user_data.get('display_name')
        }
        
        user_id = self.create_auth_user(email, password, user_metadata)
        if not user_id:
            return None
        
        # Add user ID to profile data
        profile_data = user_data.copy()
        profile_data['id'] = user_id
        
        # Create profile user
        if not self.create_profile_user(profile_data):
            print("⚠️  Auth user created but profile creation failed")
            return user_id
        
        print(f"🎉 Complete user created successfully: {email} (ID: {user_id})")
        return user_id
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user profile by email."""
        try:
            response = self.supabase.table('users').select('*').eq('email', email).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"❌ Error getting user: {e}")
            return None
    
    def list_users(self, limit: int = 10) -> List[Dict[str, Any]]:
        """List users from the database."""
        try:
            response = self.supabase.table('users').select('id, email, display_name, role, account_type, created_at').limit(limit).execute()
            return response.data or []
        except Exception as e:
            print(f"❌ Error listing users: {e}")
            return []

def interactive_user_creation(manager: SupabaseUserManager):
    """Interactive user creation process."""
    print("\n🎯 Interactive User Creation")
    print("=" * 40)
    
    user_data = {}
    
    # Required fields
    user_data['email'] = input("Email: ").strip()
    user_data['password'] = getpass("Password: ")
    
    # Optional fields
    user_data['first_name'] = input("First Name (optional): ").strip() or None
    user_data['last_name'] = input("Last Name (optional): ").strip() or None
    
    # Auto-generate display name if not provided
    if user_data['first_name'] or user_data['last_name']:
        default_display = f"{user_data['first_name'] or ''} {user_data['last_name'] or ''}".strip()
        display_name = input(f"Display Name (default: {default_display}): ").strip()
        user_data['display_name'] = display_name if display_name else default_display
    else:
        user_data['display_name'] = input("Display Name (optional): ").strip() or None
    
    # Role selection
    print("\nAvailable roles: admin, editor, user, trial")
    user_data['role'] = input("Role (default: user): ").strip() or 'user'
    
    # Account type selection
    print("\nAvailable account types: trial, non_commercial, commercial")
    user_data['account_type'] = input("Account Type (default: trial): ").strip() or 'trial'
    
    # Optional fields
    user_data['organization'] = input("Organization (optional): ").strip() or None
    user_data['bio'] = input("Bio (optional): ").strip() or None
    
    # Confirmation
    print("\n📋 User Data Summary:")
    for key, value in user_data.items():
        if key != 'password':  # Don't display password
            print(f"  {key}: {value}")
    
    confirm = input("\n✅ Create this user? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ User creation cancelled")
        return
    
    # Create user
    user_id = manager.create_complete_user(user_data)
    if user_id:
        print(f"\n🎉 User created successfully with ID: {user_id}")
    else:
        print("\n❌ User creation failed")

def batch_user_creation(manager: SupabaseUserManager, file_path: str):
    """Create users from a JSON file."""
    try:
        with open(file_path, 'r') as f:
            users_data = json.load(f)
        
        if not isinstance(users_data, list):
            users_data = [users_data]
        
        print(f"\n📦 Batch User Creation - {len(users_data)} users")
        print("=" * 50)
        
        success_count = 0
        for i, user_data in enumerate(users_data, 1):
            print(f"\n[{i}/{len(users_data)}] Processing: {user_data.get('email', 'Unknown')}")
            
            try:
                user_id = manager.create_complete_user(user_data)
                if user_id:
                    success_count += 1
            except Exception as e:
                print(f"❌ Failed to create user: {e}")
        
        print(f"\n📊 Batch creation completed: {success_count}/{len(users_data)} successful")
        
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON format in: {file_path}")
    except Exception as e:
        print(f"❌ Error in batch creation: {e}")

def main():
    parser = argparse.ArgumentParser(description='Insert users into Supabase users table')
    parser.add_argument('--email', help='User email')
    parser.add_argument('--password', help='User password')
    parser.add_argument('--first-name', help='First name')
    parser.add_argument('--last-name', help='Last name')
    parser.add_argument('--display-name', help='Display name')
    parser.add_argument('--role', default='user', choices=['admin', 'editor', 'user', 'trial'], help='User role')
    parser.add_argument('--account-type', default='trial', choices=['trial', 'non_commercial', 'commercial'], help='Account type')
    parser.add_argument('--organization', help='Organization')
    parser.add_argument('--bio', help='Bio')
    parser.add_argument('--interactive', action='store_true', help='Interactive user creation')
    parser.add_argument('--batch', help='Batch create users from JSON file')
    parser.add_argument('--list', action='store_true', help='List existing users')
    
    args = parser.parse_args()
    
    try:
        manager = SupabaseUserManager()
        
        if args.list:
            print("\n👥 Existing Users:")
            print("=" * 40)
            users = manager.list_users()
            if users:
                for user in users:
                    print(f"📧 {user['email']} | {user['display_name']} | {user['role']} | {user['account_type']}")
            else:
                print("No users found")
            return
        
        if args.interactive:
            interactive_user_creation(manager)
            return
        
        if args.batch:
            batch_user_creation(manager, args.batch)
            return
        
        if args.email and args.password:
            # Command line user creation
            user_data = {
                'email': args.email,
                'password': args.password,
                'first_name': args.first_name,
                'last_name': args.last_name,
                'display_name': args.display_name,
                'role': args.role,
                'account_type': args.account_type,
                'organization': args.organization,
                'bio': args.bio
            }
            
            user_id = manager.create_complete_user(user_data)
            if user_id:
                print(f"\n🎉 User created successfully with ID: {user_id}")
            else:
                print("\n❌ User creation failed")
            return
        
        # No specific action, show help
        print("🔧 Supabase User Management Tool")
        print("=" * 40)
        print("Usage examples:")
        print("  python insert_user.py --interactive")
        print("  python insert_user.py --email user@example.com --password pass123")
        print("  python insert_user.py --batch users.json")
        print("  python insert_user.py --list")
        print("\nFor more options, use: python insert_user.py --help")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()