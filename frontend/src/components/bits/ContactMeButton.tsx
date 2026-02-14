import { useState } from "react";
import { Button } from "../ui";

export const ContactMeButton = () => {
  const [showText, setShowText] = useState(false);
  const [broken, setBroken] = useState(false);
  const [hidden, setHidden] = useState(false);

  function toggleDrop() {
    const contactButton = document.getElementById("contact-button");
    const buttonWrapper = document.getElementById("button-wrapper");

    if (!contactButton || !buttonWrapper || broken) return;

    setShowText(true);
    contactButton.classList.add("break");

    setTimeout(() => {
      setBroken(true);
      contactButton.classList.add("breakMore");
      buttonWrapper.classList.add("fall-off-screen");
    }, 400);

    setTimeout(() => {
      setHidden(true);
    }, 1200);
  }

  return (
    <>
      <style>
        {`
          @keyframes break {
            0% {
              transform: rotate(0deg) translateY(0);    
            }
            100% {
              transform: rotate(-20deg) translateY(34px);
            }
          }
          @keyframes breakMore {
            0% {
              transform: rotate(-20deg) translateY(34px);    
            }
            100% {
              transform: rotate(-80deg) translateY(34px);
            }
          }
          @keyframes fallOffScreen {
            from {
              transform: translateY(32px);
            }
            to {
              transform: translateY(110vh);
            }
          }

          .break {
            animation: break 0.3s ease-in forwards;
          }
          .breakMore {
            animation: breakMore 0.4s ease-in forwards;
          }
          .fall-off-screen {
            animation: fallOffScreen 0.7s ease-in forwards;
          }
        `}
      </style>
      <div className="relative hidden items-center px-4 lg:flex">
        {!hidden && (
          <div id="button-wrapper" className="absolute right-0 z-10">
            <Button
              id="contact-button"
              className="min-w-48"
              onClick={toggleDrop}
            >
              Get in Touch!
            </Button>
          </div>
        )}
        {showText && <p className="tracking-wide">Gainfully Employed 👍</p>}
      </div>
    </>
  );
};
