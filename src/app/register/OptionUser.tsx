import { useRouter } from 'next/navigation'
import React from 'react'

export default function OptionUser  () {
    const router = useRouter()
  return (
    <div>
        <div className='flex items-center border-[1px] rounded-[5px] w-[250px]' onClick={() => router.push('/register/customer-register')}>
            <img src="/images/Customer.png" alt="Customer" className='w-[50px]' />
            <p>Customer</p>
        </div>
        <div className='flex mt-[15px] mb-[30px] items-center border-[1px] rounded-[5px] w-[250px]' onClick={() => router.push('/register/store-register')}>
            <img src="/images/store.png" alt="store" className='w-[50px]' />
            <p>User</p>
        </div>
    </div>
  )
}
