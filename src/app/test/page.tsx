export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>API test endpoint created. Check the terminal for logs when you try to log in.</p>
      <p className="mt-4">Try logging in with:</p>
      <ul className="list-disc list-inside mt-2">
        <li>teacher@test.com / password123</li>
        <li>student@test.com / password123</li>
      </ul>
      <p className="mt-4">Check the terminal where the dev server is running for debug logs.</p>
    </div>
  )
}