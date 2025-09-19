// app/tables/page.tsx
export const dynamic = 'force-dynamic';

export default async function TablesPage() {
  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      <h1 className="mb-8 text-3xl font-extrabold tracking-wide md:text-4xl">
        Tables
      </h1>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <p className="text-lg">
          Table reservations coming soon.
        </p>
        <p className="mt-2 opacity-80">
          For VIP enquiries please contact us via the details on the homepage footer.
        </p>
      </section>
    </main>
  );
}
