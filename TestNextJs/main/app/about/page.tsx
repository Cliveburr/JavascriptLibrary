'use client'
import { Suspense, use, useState } from "react";

// export  function Page() {

//   let isLoading = true;

//   function fetch() {
//     return new Promise((e, r) =>
//       {
//         setTimeout(e, 5000);
//       })
//   }

//   async function view() {

//     await fetch();

//     return <h1>Sera que vai d!</h1>;
//   }

//   return <Suspense fallback={<h1>Loading...</h1>}>
//     {view()}
//   </Suspense>
// }

export default function Page() {

  const [isLoading, setLoaded] = useState(true);

  setTimeout(() => {
    setLoaded(false);
  }, 3000);

  if (isLoading) {
    return <h1>Loading!!!</h1>;
  }

  return <h1>This is the loaded page!</h1>;
}