export default function Container({children}: {children: React.ReactNode}) {
  return (
    <main id="skip" className=" flex flex-col justify-center px-8 ">
      {children}
    </main>
  )
}
