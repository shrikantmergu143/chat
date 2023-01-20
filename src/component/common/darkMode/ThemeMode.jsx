import React, { useState } from 'react';
import { Image } from "react-bootstrap";
import { ThemeChangeBtn } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import LightMode from "../../../assets/img/lightmodeicon.svg";
import DarkMode from "../../../assets/img/darkmodeicon.svg";
import Tooltip from '../tooltip';

const ThemeMode = () => {
  const [darkmodeImage, setDarkmodeImage] = useState(false);
  let clickedClass = 'clicked';
  const body = document.body;
  const lightTheme = 'light';
  const darkTheme = 'dark';
  let theme;
  const dispatch = useDispatch();

  // localStorage getvalue
  if (localStorage) {
    theme = localStorage.getItem('theme');
  }

  // automatically class added to body
  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(lightTheme);
  }

  // Condition wise dark and light theme value stored localStorage
  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      e.target.classList.remove(clickedClass);
      localStorage.setItem('theme', 'light');
      theme = lightTheme;
      setDarkmodeImage(true);
      dispatch(ThemeChangeBtn("light"));
    } else {
      body.classList.replace(lightTheme, darkTheme);
      e.target.classList.add(clickedClass);
      localStorage.setItem('theme', 'dark');
      theme = darkTheme;
      setDarkmodeImage(false);
      dispatch(ThemeChangeBtn("dark"));
    }
  };

  return (
      <div className={theme === "dark" ? "theme-switch dark" : "theme-switch light"} onClick={(e) => switchTheme(e)}>
          <div className={theme === "active" ? "theme-switch-image active" : "theme-switch-image"}>
            <Tooltip content="Light mode" direction="top">
              <Image src={LightMode} alt="light mode" />
            </Tooltip>
          </div>        
          <div className={theme === "dark" ? "theme-switch-image active" : "theme-switch-image"}>
            <Tooltip content="Dark mode" direction="top">
              <Image src={DarkMode} alt="light mode" />
            </Tooltip>
          </div>
      </div>
  );
};

export default ThemeMode;
