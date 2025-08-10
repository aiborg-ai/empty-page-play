from supabase import create_client, Client

# Your Supabase project details
url = "https://lkpykvqkobvldrpdktks.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcHlrdnFrb2J2bGRycGRrdGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTY5ODgsImV4cCI6MjA3MDMzMjk4OH0.44Dj6vX_cnkrsBbjnxSG3lJgR9RK24U3UuT7n1yNKbE"

supabase: Client = create_client(url, key)

# Replace 'users' with your actual table name
table_name = "users"

# Insert the username
data = supabase.table(table_name).insert({"username": "NewNewVik"}).execute()

print(data)