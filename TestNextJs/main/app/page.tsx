'use client'
import Link from 'next/link';


export default function Page() {

    function activateLasers(e) {
        e.preventDefault();
        console.log('You clicked submit.');
      }

    return <>
        <h1>Hello, Next.js 222 2!</h1>
        <button onClick={activateLasers}>
            Activate Lasers
        </button>
        <Link href="/about">About</Link>
        <Link href="/server">server</Link>
    </>


  }