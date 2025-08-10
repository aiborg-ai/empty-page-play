import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            <p className="text-gray-700 leading-relaxed">
              At InnoSpot, we are committed to protecting your privacy and maintaining the confidentiality of your personal information. 
              This Privacy Policy explains how we collect, use, and protect your information when you use our patent intelligence platform.
            </p>
          </section>

          {/* Key Principles */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Privacy Principles</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Your Research is Your Business:</strong> We consider your use of InnoSpot to be your business, not ours. 
                  We are committed to maintaining the confidentiality of your patent research and innovation intelligence activities.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Minimal Data Collection:</strong> We collect only the information necessary to provide our services 
                  and improve your experience on the platform.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Transparency:</strong> We provide clear information about what data we collect, how we use it, 
                  and your rights regarding your personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Information You Provide</h4>
                <p className="text-gray-700 mb-3">
                  When you create an account or interact with our services, we may collect:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Email address:</strong> Required for account activation, responding to inquiries, 
                    service updates, and providing alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Account information:</strong> Username, first name, last name, and account type 
                    (trial, non-commercial, or commercial)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Profile preferences:</strong> Search history settings, notification preferences, 
                    and other customization options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Communications:</strong> Messages you send us, feedback, and support requests</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-800 font-medium">
                    Important: We do NOT share your personal details, including your email address, 
                    with anyone unless we have your explicit permission.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Information Collected Automatically</h4>
                <p className="text-gray-700 mb-3">
                  When you use InnoSpot, we automatically collect certain technical information:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Log data:</strong> IP address, browser type (user-agent), referring website, 
                    and URLs accessed within our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Usage analytics:</strong> Aggregated, anonymized data about how you interact 
                    with our platform using self-hosted analytics tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>Search queries:</strong> Patent searches and research activities (stored only if you 
                    opt-in to search history recording)</span>
                  </li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  <strong>Data Retention:</strong> Server logs are automatically deleted after 4 weeks. 
                  We maintain anonymized usage statistics for service improvement purposes.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
            <p className="text-gray-700 mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Provide and improve our patent intelligence services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Authenticate your account and maintain platform security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Send important service updates and notifications (if enabled)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Respond to your inquiries and provide customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Analyze usage patterns to improve platform performance and features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Ensure compliance with legal obligations and platform terms</span>
              </li>
            </ul>
          </section>

          {/* Data Protection and Security */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Protection and Security</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Encryption:</strong> All data transmission is secured using TLS encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Regular Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>Data Minimization:</strong> We retain personal data only as long as necessary 
                  for service provision and legal compliance</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                InnoSpot uses cookies and similar technologies to enhance your experience:
              </p>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800">Essential Cookies</h5>
                  <p className="text-gray-600 text-sm">
                    Required for basic platform functionality, authentication, and security. These cannot be disabled.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Analytics Cookies</h5>
                  <p className="text-gray-600 text-sm">
                    Help us understand how users interact with our platform through anonymized usage statistics. 
                    You can opt out of analytics tracking in your account settings.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Preference Cookies</h5>
                  <p className="text-gray-600 text-sm">
                    Remember your settings and preferences to improve your user experience.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                You can manage cookies through your browser settings. However, disabling certain cookies may affect 
                platform functionality.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h3>
            <p className="text-gray-700 mb-3">
              To provide our services, we may work with trusted third-party providers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Infrastructure & Hosting</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Cloud hosting services</li>
                  <li>• Content delivery networks</li>
                  <li>• Database services</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Communication & Support</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Email delivery services</li>
                  <li>• Customer support platforms</li>
                  <li>• Communication tools</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Analytics & Monitoring</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Self-hosted analytics platforms</li>
                  <li>• Error monitoring services</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Payment Processing</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Payment gateway services</li>
                  <li>• Subscription management</li>
                  <li>• Financial reporting</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              All third-party providers are carefully vetted and required to maintain appropriate data protection standards.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h3>
            <p className="text-gray-700 mb-3">
              You have the following rights regarding your personal information:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800">Access and Portability</h5>
                  <p className="text-gray-600 text-sm">Request a copy of your personal data in a portable format</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800">Rectification</h5>
                  <p className="text-gray-600 text-sm">Update or correct inaccurate personal information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800">Erasure</h5>
                  <p className="text-gray-600 text-sm">Request deletion of your personal data (subject to legal obligations)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800">Restriction of Processing</h5>
                  <p className="text-gray-600 text-sm">Limit how we process your personal information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800">Objection</h5>
                  <p className="text-gray-600 text-sm">Object to processing of your personal data in certain circumstances</p>
                </div>
              </div>
            </div>
          </section>

          {/* International Data Transfers */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">International Data Transfers</h3>
            <p className="text-gray-700 mb-3">
              InnoSpot serves users globally, and your personal information may be transferred to and processed in 
              countries other than your own. When we transfer personal data internationally, we ensure appropriate 
              safeguards are in place, including:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Standard contractual clauses approved by relevant authorities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Adequacy decisions by competent data protection authorities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Other legally recognized transfer mechanisms</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Retention</h3>
            <p className="text-gray-700 mb-3">
              We retain personal information only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Account data:</strong> Retained while your account is active and for a reasonable period after closure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Search history:</strong> Retained only if you opt-in, with user-controlled deletion options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>System logs:</strong> Automatically deleted after 4 weeks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Legal compliance:</strong> Some data may be retained longer to meet legal obligations</span>
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Children's Privacy</h3>
            <p className="text-gray-700">
              InnoSpot is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately so we can take appropriate action.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h3>
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              When we make material changes, we will:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Post the updated policy on this page with a new effective date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Notify you via email or platform notification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Provide a reasonable notice period before changes take effect</span>
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:privacy@innospot.com" className="text-blue-600 hover:underline">privacy@innospot.com</a>
              </p>
              <p className="text-gray-700">
                <strong>Data Protection Officer:</strong> <a href="mailto:dpo@innospot.com" className="text-blue-600 hover:underline">dpo@innospot.com</a>
              </p>
              <p className="text-gray-700">
                <strong>Mailing Address:</strong><br />
                InnoSpot Privacy Team<br />
                [Your Business Address]<br />
                [City, State, ZIP Code]<br />
                [Country]
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              We will respond to your privacy-related inquiries within 30 days of receipt.
            </p>
          </section>

          {/* Legal Basis */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Basis for Processing (GDPR)</h3>
            <p className="text-gray-700 mb-3">
              For users in the European Economic Area, we process personal data based on the following legal bases:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Contract:</strong> Processing necessary for service provision and account management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Legitimate Interest:</strong> Platform improvement, security, and user experience enhancement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Consent:</strong> Optional features like marketing communications and advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>Legal Obligation:</strong> Compliance with applicable laws and regulations</span>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}