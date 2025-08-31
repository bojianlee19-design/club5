export default function SignUp() {
  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-semibold mb-4">Sign Up</h1>
      <form action="/api/newsletter" method="post" className="card p-6 space-y-3 max-w-lg">
        <div><label>Email</label><input type="email" name="email" required placeholder="you@example.com" /></div>
        <button className="btn btn-primary" type="submit">Join the newsletter</button>
      </form>
    </div>
  )
}
