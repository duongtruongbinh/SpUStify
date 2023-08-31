import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';


import { logo } from "../assets";
import { links } from "../assets/constants";

const NavLinks = ({ handleClick}) =>{

const { isArtist } = useSelector((state) => state.player);


return (

  <div className="mt-10">
    {links.map((item) => {

if (isArtist === true && item.name === 'Upload Song' ) {
  return (
<NavLink
  key={item.name}
  to={item.to}
  className="flex flex-row justify-start items-center my-8 text-xs font-medium text-gray-500 hover:text-gray-400"
  onClick={() => handleClick && handleClick()}
>
  <item.icon className="w-4 h-6 mr-2" />
  {item.name}
</NavLink> 
  )

}     else if(item.name !== 'Upload Song') {
  
  return (
<NavLink
      key={item.name}
      to={item.to}
      className="flex flex-row justify-start items-center my-8 text-xs font-medium text-gray-500 hover:text-gray-400"
      onClick={() => handleClick && handleClick()}
    >
      <item.icon className="w-4 h-6 mr-2" />
      {item.name}
    </NavLink>
  )

} 
    
}
)
}
    
  </div>
);
}

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#212124]">
        <a
          href="/"
          className="text-white flex my-8 px-6 w-full items-center justify-center">
          <div className="text-white text-3xl">SPUSTIFY</div>
          <img src={logo} alt="logo" className="h-14" />
        </a>
        <NavLinks />
      </div>

      <div className="absolute md:hidden block top-6 right-3">
        {mobileMenuOpen ? (
          <RiCloseLine
            className="w-6 h-6 text-gray-100 mr-2"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : (
          <HiOutlineMenu
            className="w-6 h-6 text-gray-100 mr-2"
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 backdrop-blur-lg backdrop-brightness-50 z-10 p-6 md:hidden smooth-transition
      ${mobileMenuOpen ? "left-0" : "-left-full"}`}>
        <img src={logo} alt="logo" className="w-full h-24 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
