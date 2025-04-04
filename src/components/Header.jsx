"use client"
import { usePathname } from 'next/navigation';
import React, { useContext, useState } from 'react'
import "../styles/header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faRightFromBracket, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '@/services/context/UserContext';
import Link from 'next/link';


function Header() {
  const pathname = usePathname();
  const {user,handleLogOut}= useContext(UserContext) 
  const [dropdownIsActive,setDropdownIsActive] = useState(false);

  if(pathname == "/login" || !user){
    return null;
  }


  function handleToggleDropdown() {
    setDropdownIsActive(!dropdownIsActive)
  }

  return (
      <header className="flex justify-between pl-12 pr-6 bg-white">
        
        <div className="flex gap-[50px] lg:gap-[200px]">
          <img className="h-[80px] py-3 hidden md:block" src="./logo.png" alt="" />
          <img className="h-[60px] py-3 md:hidden" src="./icon.png" alt="" />
            <ul className="flex items-center">
                <Link href="/" className="block h-full" ><li className={`${pathname=="/" && "active"}`}>
                  <span className='md:hidden'>
                    <FontAwesomeIcon icon={faHouse} />
                  </span>
                  <span className="hidden md:block">Ana səhifə</span>
                </li></Link>
                {user.isAdmin && 
                  <Link href="/doctors" className="block h-full" ><li className={`${pathname=="/doctors" && "active"}`}>
                    <span className='md:hidden'>
                      <FontAwesomeIcon icon={faUserDoctor} />
                    </span>
                    <span className="hidden md:block">Həkimlər</span>
                  </li></Link>
                }
            </ul>
        </div>
        <div id="user" className="relative flex items-center justify-between gap-3" >
            <button className="relative flex items-center justify-between gap-3" id="dropdownBtn" onClick={handleToggleDropdown} >
              <p className="text-[#232323] text-[18px] font-[500] leading-[150%]">{user?.name+" "+user?.surname}</p>
              <svg className={`duration-500 ${dropdownIsActive && "rotate-180"}`} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.5">
                    <path d="M5 12.6699L10 7.66992L15 12.6699" stroke="#232323" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
              </svg>     
            </button>
            <div id="dropdown" className={`${dropdownIsActive && "active"} absolute z-50 w-full rounded-lg bg-white p-3 top-[120%]`}>
              <button onClick={()=>{handleLogOut();setDropdownIsActive(false)}} className="w-full flex justify-between items-center text-red-700">Çıxış  <FontAwesomeIcon icon={faRightFromBracket}/></button>
            </div>
        </div>
    </header>
  )
}

export default Header
