# Supabase User Management Script

This Python script allows you to easily insert new users into your Supabase users table. It handles both authentication (auth.users) and user profiles (public.users).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env
# Edit .env with your Supabase URL and keys
```

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: (Optional but recommended) Service role key for admin operations

### 3. Run the Script

```bash
# Interactive mode (recommended for first-time users)
python insert_user.py --interactive

# Quick single user creation
python insert_user.py --email user@example.com --password password123

# Batch create users from JSON file
python insert_user.py --batch sample_users.json

# List existing users
python insert_user.py --list
```

## 📋 Usage Examples

### Interactive Mode
The easiest way to create users with guided prompts:

```bash
python insert_user.py --interactive
```

### Command Line Mode
Create a user directly from command line:

```bash
python insert_user.py \
  --email "researcher@university.edu" \
  --password "securepass123" \
  --first-name "Jane" \
  --last-name "Smith" \
  --display-name "Dr. Jane Smith" \
  --role "user" \
  --account-type "non_commercial" \
  --organization "University Research Lab"
```

### Batch Mode
Create multiple users from a JSON file:

```bash
python insert_user.py --batch sample_users.json
```

Sample JSON format:
```json
[
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "role": "user",
    "account_type": "trial",
    "organization": "Example Corp",
    "bio": "Description of the user"
  }
]
```

## 🔧 Available Options

### User Roles
- `admin`: Full platform access
- `editor`: Can edit content and manage projects
- `user`: Standard user access
- `trial`: Limited trial access

### Account Types
- `trial`: Trial account with limited features
- `non_commercial`: For academic/research use
- `commercial`: Full commercial license

## 📊 User Table Schema

The script creates users in both:
1. **auth.users**: Supabase authentication table
2. **public.users**: Your application's user profile table

### Fields in public.users:
- `id` (UUID): References auth.users(id)
- `email` (TEXT): User email
- `first_name` (TEXT): First name
- `last_name` (TEXT): Last name
- `display_name` (TEXT): Display name
- `avatar_url` (TEXT): Profile picture URL
- `role` (ENUM): User role
- `account_type` (ENUM): Account type
- `organization` (TEXT): Organization name
- `bio` (TEXT): User biography
- `preferences` (JSONB): User preferences
- `subscription_status` (TEXT): Subscription status
- `subscription_expires_at` (TIMESTAMPTZ): Subscription expiry
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

## 🛠️ Advanced Usage

### Service Role Key
For full functionality, add your Supabase service role key to the `.env` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

This enables:
- Creating auth users programmatically
- Bypassing Row Level Security (RLS)
- Admin-level operations

### Error Handling
The script includes comprehensive error handling:
- ✅ Connection validation
- ✅ Input validation
- ✅ Duplicate email detection
- ✅ Transaction rollback on failure
- ✅ Detailed error messages

### Existing User Handling
- The script will update existing profiles if the user already exists
- Authentication users cannot be overwritten (Supabase limitation)
- Use `--list` to see existing users before creating new ones

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **Service Role Key**: Keep this secret - it has admin privileges
3. **Passwords**: Use strong passwords for production users
4. **Network**: Run script from secure networks only

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase credentials"**
- Check that `.env` file exists and contains correct URLs/keys
- Verify environment variable names match exactly

**"User not authenticated"**
- You need the service role key for creating auth users
- Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file

**"Email already exists"**
- User already exists in auth.users table
- Use `--list` to check existing users
- Consider updating profile instead

**"Connection refused"**
- Check your Supabase URL is correct
- Verify your project is active
- Check network connectivity

### Getting Help

1. Check Supabase dashboard for project status
2. Verify your API keys in Supabase Settings > API
3. Test connection with a simple query first
4. Check the script logs for detailed error messages

## 📈 Monitoring

The script provides detailed feedback:
- ✅ Success indicators
- ❌ Error messages
- 📊 Batch operation summaries
- 🔑 Authentication status
- 👥 User listing capabilities

## 🎯 Integration

This script can be integrated into:
- CI/CD pipelines
- User onboarding workflows
- Admin panels
- Automated testing setups
- Data migration processes