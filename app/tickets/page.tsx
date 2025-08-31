export default function Tickets() {
  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-semibold mb-4">Tickets</h1>
      <p className="text-white/70 mb-4">Find tickets for upcoming events via our official partners.</p>
      <div className="card p-6">
        <ul className="list-disc list-inside text-white/70">
          <li><a className="underline" href="https://ra.co/" target="_blank">Resident Advisor</a></li>
          <li><a className="underline" href="https://dice.fm/" target="_blank">DICE</a></li>
          <li><a className="underline" href="https://fatsoma.com/" target="_blank">Fatsoma</a></li>
        </ul>
      </div>
    </div>
  )
}
