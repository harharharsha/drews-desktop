import { useEffect, useRef, useState } from "react";
import "./index.css";

const PASSWORD = "hi";

function App() {
  const [screen, setScreen] = useState("terminal");

  return (
    <>
      {screen === "terminal" && (
        <TerminalBootScreen onBoot={() => setScreen("booting")} />
      )}

      {screen === "booting" && (
  <WindowsStartupLogin onDone={() => setScreen("preparing")} />
)}

{screen === "preparing" && (
  <PreparingDesktopScreen onDone={() => setScreen("unlocked")} />
)}

{screen === "unlocked" && <UnlockedScreen />}
    </>
  );
}

function PreparingDesktopScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <div
      className="windows-font flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}login_background.png)`,
      }}
    >
      <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />

      <p className="text-3xl text-white drop-shadow-md">
        Preparing your desktop
      </p>
    </div>
  );
}

function TerminalBootScreen({ onBoot }) {
  const [typedText, setTypedText] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  function handleKeyDown(event) {
    if (isLeaving) return;

    const key = event.key.toLowerCase();

    if (key === "y") {
      setTypedText("y");
      setIsLeaving(true);

      setTimeout(() => {
        onBoot();
      }, 900);
    }

    if (key === "n") {
      setTypedText("n");
    }

    if (key === "backspace") {
      setTypedText("");
    }
  }

  return (
    <div
      className="min-h-screen bg-black p-6 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      autoFocus
    >
      <div
        className={`terminal-font text-left text-[#00ff00] transition-opacity duration-700 ${
          isLeaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <pre className="whitespace-pre-wrap text-2xl leading-none">
{`boot up pc? (y/n)

> ${typedText}_`}
        </pre>
      </div>
    </div>
  );
}

function WindowsStartupLogin({ onDone }) {
  const [showBackground, setShowBackground] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [typedLogoText, setTypedLogoText] = useState("");
  const [moveLogoUp, setMoveLogoUp] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showStartingText, setShowStartingText] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  function playStartupSound() {
    const audio = new Audio(`${import.meta.env.BASE_URL}startup_sound.mp3`);
    audio.volume = 0.5;

    audio.play().catch(() => {
      console.log("Startup sound could not play.");
    });
  }

  function chooseUser() {
  setSelectedUser(true);

  setTimeout(() => {
    setShowPassword(true);
  }, 1000);
}

  function handleSubmit(event) {
  event.preventDefault();

  if (password.toLowerCase() === PASSWORD) {
    setError("");
    onDone();
  } else {
    const newWrongAttempts = wrongAttempts + 1;
    setWrongAttempts(newWrongAttempts);

    if (newWrongAttempts >= 2) {
      setError("wrong again :3 hint: harshaissupercool");
    } else {
      setError("Wrong password :3");
    }

    setPassword("");
  }
}

  useEffect(() => {
    let typingInterval;

    const backgroundTimer = setTimeout(() => {
      setShowBackground(true);
    }, 100);

    const logoTimer = setTimeout(() => {
      setShowLogo(true);
      playStartupSound();
    }, 700);

    const textTimer = setTimeout(() => {
      const word = "woofdows";
      let index = 0;

      typingInterval = setInterval(() => {
        setTypedLogoText(word.slice(0, index + 1));
        index += 1;

        if (index >= word.length) {
          clearInterval(typingInterval);
        }
      }, 140);
    }, 1400);

    const startingTextTimer = setTimeout(() => {
  setShowStartingText(true);
}, 5700);

    const moveLogoTimer = setTimeout(() => {
      setMoveLogoUp(true);
    }, 9200);

    const userTimer = setTimeout(() => {
      setShowUserSelect(true);
    }, 10500);

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(moveLogoTimer);
      clearTimeout(userTimer);
      clearTimeout(startingTextTimer);

      if (typingInterval) {
        clearInterval(typingInterval);
      }
    };
  }, []);

  return (
    <div
  className="windows-font relative min-h-screen overflow-hidden bg-black"
>
  <div
    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
      showBackground ? "opacity-100" : "opacity-0"
    }`}
    style={{
      backgroundImage: `url(${import.meta.env.BASE_URL}login_background.png)`,
    }}
  />
      <div className={`pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 transition-all duration-[2400ms] ease-in-out ${
    showLogo ? "opacity-100" : "opacity-0"
  } ${
    moveLogoUp
      ? "top-[90%] -translate-y-1/2 scale-35"
      : "top-1/2 -translate-y-1/2 scale-70"
  }`}
>
        <img
          src={`${import.meta.env.BASE_URL}dog_logo.png`}
          alt="Dog logo"
          className="w-[360px] max-w-[35vw] object-contain"
        />

        <div
  className="overflow-hidden transition-all duration-[1800ms] ease-linear"
  style={{
    width: typedLogoText.length === 0 ? "0px" : `${typedLogoText.length * 95}px`,
    maxWidth: "720px",
  }}
>
  <img
    src={`${import.meta.env.BASE_URL}woofdows_text.png`}
    alt="Woofdows text"
    className="w-[720px] max-w-none object-contain"
    draggable="false"
  />
</div>
      </div>

      {!moveLogoUp && showStartingText && (
  <p className="absolute left-1/2 top-[68%] z-10 -translate-x-1/2 text-xl text-white drop-shadow">
    Starting Woofdows...
  </p>
)}

      <div
        className={`absolute left-1/2 top-[43%] z-20 flex -translate-x-1/2 flex-col items-center transition-all duration-700 ${
          showUserSelect
  ? selectedUser
    ? "opacity-100 pointer-events-none -translate-y-[150px]"
    : "opacity-100 pointer-events-auto translate-y-0"
  : "opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        <p
  className={`mb-7 text-3xl text-white drop-shadow-md transition-opacity duration-500 ${
    selectedUser ? "opacity-0" : "opacity-100"
  }`}
>
  Select a user
</p>

        <button
          type="button"
          onClick={chooseUser}
          className="group flex cursor-pointer flex-col items-center bg-transparent p-0 transition hover:scale-105"
        >
          <img
  src={`${import.meta.env.BASE_URL}profile_photo.png`}
  alt="Andrew profile"
  className="h-36 w-36 cursor-pointer object-contain transition-all duration-1000 ease-in-out"
  draggable="false"
/>

          <span
  className={`mt-4 cursor-pointer text-2xl text-white drop-shadow-md transition-opacity duration-500 ${
    selectedUser ? "opacity-0" : "opacity-100"
  }`}
>
  Andrew
</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`absolute left-1/2 top-[55%] z-30 flex -translate-x-1/2 flex-col items-center transition-all duration-[1200ms] ease-in-out ${
  showPassword
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none"
} ${showPassword ? "-translate-y-[80px]" : "-translate-y-1/2"}`}
      >
        <img
  src={`${import.meta.env.BASE_URL}profile_photo.png`}
  alt="Andrew profile"
  className="hidden"
  draggable="false"
/>

        <p className="mt-4 text-3xl #edetext-[1c9] text-white drop-shadow-md">Andrew</p>

        <div
          className={`mt-6 flex flex-col items-center transition-opacity duration-700 ${
            showPassword ? "opacity-100" : "opacity-0"
          }`}
        >
          <label className="mb-2 text-sm text-white drop-shadow">
            Password
          </label>

          <div className="flex items-center">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus={showPassword}
              className="h-10 w-64 rounded-l-sm border border-gray-400 bg-white px-3 text-lg text-black shadow-inner outline-none focus:border-blue-500"
            />

            <button
  type="submit"
  className="h-10 w-11 rounded-r-sm border border-l-0 border-gray-400 bg-gradient-to-b from-[#6fb7ff] to-[#1f67c7] text-xl text-white shadow hover:from-[#82c4ff] hover:to-[#2a74dc]"
>
  →
</button>
          </div>

          {error && (
            <p className="mt-4 rounded bg-white/15 px-4 py-2 text-sm text-white shadow">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function UnlockedScreen() {
  const [showDesktop, setShowDesktop] = useState(false);
  const [messagesClicked, setMessagesClicked] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [showMessagePopup, setShowMessagePopup] = useState(true);
  const [showLetterChaos, setShowLetterChaos] = useState(false);

  const [allPiecesFound, setAllPiecesFound] = useState(false);
  const [letterHasBroken, setLetterHasBroken] = useState(false);
  const [messagesMode, setMessagesMode] = useState("normal");
  const [showSecondMessagePopup, setShowSecondMessagePopup] = useState(false);
  const [showFixPopup, setShowFixPopup] = useState(false);
  const [fixPopupStep, setFixPopupStep] = useState("warning");
  const [secondMessageReady, setSecondMessageReady] = useState(false);
  const [collectedPieces, setCollectedPieces] = useState([]);
  const [trashEmptied, setTrashEmptied] = useState(false);
  const [showMixingAgentPopup, setShowMixingAgentPopup] = useState(false);
  const [showInstructionsImage, setShowInstructionsImage] = useState(false);
const [showCauldronPopup, setShowCauldronPopup] = useState(false);
const [cauldronPopupStep, setCauldronPopupStep] = useState("needCauldron");
const [internetUnlocked, setInternetUnlocked] = useState(false);
const [cauldronAppUnlocked, setCauldronAppUnlocked] = useState(false);
const [lockedAppPopup, setLockedAppPopup] = useState(null);
const [showShutdownPopup, setShowShutdownPopup] = useState(false);
const [shutdownStep, setShutdownStep] = useState("confirm");
const [isBlackScreen, setIsBlackScreen] = useState(false);
const [letterIsFixed, setLetterIsFixed] = useState(false);
const [finalMessageReady, setFinalMessageReady] = useState(false);
const [showFinalMessagePopup, setShowFinalMessagePopup] = useState(false);
  

  const desktopIcons = [
    {
      id: "messages",
      name: "Messages",
      image: messagesClicked ? "messages_icon.png" : "messages_icon_unread.png",
      side: "left",
    },
    {
      id: "mail",
      name: "Mail",
      image: "mail_icon.png",
      side: "left",
    },
    {
      id: "photos",
      name: "Photos",
      image: "photos_icon.png",
      side: "left",
    },
    {
      id: "inventory",
      name: "Inventory",
      image: "inventory_icon.png",
      side: "left",
    },
    {
      id: "music",
      name: "Music",
      image: "music_icon.png",
      side: "right",
    },
    {
      id: "files",
      name: "Files",
      image: "files_icon.png",
      side: "right",
    },
    {
      id: "internet",
      name: "Internet",
      image: "internet_icon.png",
      side: "right",
    },
    {
  id: "trash",
  name: "Trash",
  image: trashEmptied ? "trash_icon_empty.png" : "trash_icon.png",
  side: "right",
},

...(cauldronAppUnlocked
  ? [
      {
  id: "cauldron",
  name: "Cauldron",
  image: "cauldron.png",
  side: "special",
},
    ]
  : []),
  ];

  function closeApp(appId) {
    setOpenWindows((currentWindows) =>
      currentWindows.filter((window) => window.id !== appId)
    );
  }

  function startShutdown() {
  setShowShutdownPopup(true);
  setShutdownStep("confirm");
}

function confirmShutdown() {
  playSound("shutdown.mp3", 0.7);

  setShutdownStep("shutting");

  setTimeout(() => {
    setIsBlackScreen(true);
  }, 5000);
}

  function playTrashSound() {
  const audio = new Audio(`${import.meta.env.BASE_URL}trash_sound.mp3`);
  audio.volume = 0.6;

  audio.play().catch(() => {
    console.log("Trash sound could not play.");
  });
}

function playSound(fileName, volume = 0.6) {
  const audio = new Audio(`${import.meta.env.BASE_URL}${fileName}`);
  audio.volume = volume;

  audio.play().catch(() => {
    console.log(`${fileName} could not play.`);
  });
}

  function startLetterChaos() {
    closeApp("messages");
    setShowLetterChaos(true);
  }

  function finishLetterChaos() {
  setShowLetterChaos(false);
  setLetterHasBroken(true);
  setSecondMessageReady(false);
  setMessagesMode("normal");
  setMessagesClicked(false);
  setShowSecondMessagePopup(true);
  setShowFixPopup(false);
  setFixPopupStep("warning");

  closeApp("messages");
}

  function openApp(icon) {
  if (!letterHasBroken && icon.id !== "messages") {
    setLockedAppPopup(icon);
    return;
  }

  if (letterHasBroken && icon.id === "internet" && !internetUnlocked) {
    setLockedAppPopup(icon);
    return;
  }

  if (icon.id === "trash") {
    if (!collectedPieces.includes("mixingAgent")) {
      setCollectedPieces((currentPieces) => [...currentPieces, "mixingAgent"]);
      setShowMixingAgentPopup(true);
      setTrashEmptied(true);
      playTrashSound();
    }

    return;
  }

  if (icon.id === "messages") {
    if (letterIsFixed && finalMessageReady) {
  setMessagesMode("final");
  setFinalMessageReady(false);
  setShowFinalMessagePopup(false);
} else if (letterHasBroken && !allPiecesFound && !secondMessageReady) {
      return;
    } else if (letterHasBroken && !allPiecesFound && secondMessageReady) {
      setMessagesMode("afterBreak");
      setShowSecondMessagePopup(false);
      setFixPopupStep("warning");

      setTimeout(() => {
        setShowFixPopup(true);
      }, 1500);
    } else {
      setMessagesMode("normal");
      setShowMessagePopup(false);
    }

    setMessagesClicked(true);
  }

  setOpenWindows((currentWindows) => {
    const alreadyOpen = currentWindows.some((window) => window.id === icon.id);

    if (alreadyOpen) {
      return currentWindows;
    }

    return [...currentWindows, icon];
  });
}

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setShowDesktop(true);
    }, 100);

    const audio = new Audio(`${import.meta.env.BASE_URL}desktop_sound.mp3`);
    audio.volume = 0.5;

    audio.play().catch(() => {
      console.log("Desktop sound could not play.");
    });

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

 const messagesWindowIsOpen = openWindows.some(
  (window) => window.id === "messages"
);

const mailWindowIsOpen = openWindows.some(
  (window) => window.id === "mail"
);

const photosWindowIsOpen = openWindows.some(
  (window) => window.id === "photos"
);

const inventoryWindowIsOpen = openWindows.some(
  (window) => window.id === "inventory"
);

const musicWindowIsOpen = openWindows.some(
  (window) => window.id === "music"
);

const filesWindowIsOpen = openWindows.some(
  (window) => window.id === "files"
);

const internetWindowIsOpen = openWindows.some(
  (window) => window.id === "internet"
);

const cauldronWindowIsOpen = openWindows.some(
  (window) => window.id === "cauldron"
);

if (isBlackScreen) {
  return <div className="min-h-screen bg-black" />;
}

  return (
    <div
      className={`windows-font relative min-h-screen overflow-hidden bg-cover bg-center transition-opacity duration-500 ${
        showDesktop ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}desktop_background.png)`,
      }}
    >
      <div className="absolute left-5 top-5 z-20 flex flex-col gap-6">
        {desktopIcons
          .filter((icon) => icon.side === "left")
          .map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => openApp(icon)}
              className="group flex w-[136px] flex-col items-center rounded px-2 py-1 text-white drop-shadow-md hover:bg-white/20"
            >
              <img
                src={`${import.meta.env.BASE_URL}${icon.image}`}
                alt={icon.name}
                className="h-[120px] w-[120px] object-contain"
                draggable="false"
              />
              <span className="mt-1 text-center text-sm leading-tight">
                {icon.name}
              </span>
            </button>
          ))}
      </div>

      <div className="absolute right-5 top-5 z-20 flex flex-col gap-6">
        {desktopIcons
          .filter((icon) => icon.side === "right")
          .map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => openApp(icon)}
              className="group flex w-[136px] flex-col items-center rounded px-2 py-1 text-white drop-shadow-md hover:bg-white/20"
            >
              <img
                src={`${import.meta.env.BASE_URL}${icon.image}`}
                alt={icon.name}
                className="h-[120px] w-[120px] object-contain"
                draggable="false"
              />
              <span className="mt-1 text-center text-sm leading-tight">
                {icon.name}
              </span>
            </button>
          ))}
      </div>

      <div className="absolute right-[68%] top-[18%] z-20">
  {desktopIcons
    .filter((icon) => icon.side === "special")
    .map((icon) => (
      <button
        key={icon.id}
        type="button"
        onClick={() => openApp(icon)}
        className="group flex w-[136px] flex-col items-center rounded px-2 py-1 text-white drop-shadow-md hover:bg-white/20"
      >
        <img
          src={`${import.meta.env.BASE_URL}${icon.image}`}
          alt={icon.name}
          className="h-[120px] w-[120px] object-contain"
          draggable="false"
        />
        <span className="mt-1 text-center text-sm leading-tight">
          {icon.name}
        </span>
      </button>
    ))}
</div>

      {showMessagePopup && !messagesClicked && !letterHasBroken && (
        <div className="absolute left-1/2 top-24 z-50 w-80 -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
            <span>Woofdows Message</span>
            <button
              type="button"
              onClick={() => setShowMessagePopup(false)}
              className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4 px-4 py-5">
            <img
              src={`${import.meta.env.BASE_URL}messages_icon_unread.png`}
              alt="Message"
              className="h-12 w-12 object-contain"
              draggable="false"
            />

            <p className="text-lg">You have one(1) new message!</p>
          </div>

          <div className="flex justify-end px-3 pb-3">
            <button
              type="button"
              onClick={() => setShowMessagePopup(false)}
              className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
            >
              OK
            </button>
          </div>
        </div>
      )}

{showMixingAgentPopup && (
  <div className="absolute left-1/2 top-28 z-[95] w-80 -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[3px_3px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>Trash</span>

      <button
        type="button"
        onClick={() => setShowMixingAgentPopup(false)}
        className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
      >
        ×
      </button>
    </div>

    <div className="flex items-center gap-4 px-4 py-5">
      <img
        src={`${import.meta.env.BASE_URL}glue_bottle.png`}
        alt="Mixing agent"
        className="h-14 w-14 object-contain"
        draggable="false"
      />

      <p className="text-lg">mixing agent found!</p>
    </div>

    <div className="flex justify-end px-3 pb-3">
      <button
        type="button"
        onClick={() => setShowMixingAgentPopup(false)}
        className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
      >
        OK
      </button>
    </div>
  </div>
)}

{showInstructionsImage && (
  <div className="absolute left-1/2 top-1/2 z-[100] w-[620px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[5px_5px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>instructions.png</span>

      <button
        type="button"
        onClick={() => {
          setShowInstructionsImage(false);
          setCauldronPopupStep("needCauldron");
          setShowCauldronPopup(true);
        }}
        className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
      >
        ×
      </button>
    </div>

    <div className="flex items-center justify-center p-4">
      <img
        src={`${import.meta.env.BASE_URL}instructions.png`}
        alt="Instructions"
        className="max-h-[520px] max-w-full object-contain"
        draggable="false"
      />
    </div>
  </div>
)}

{showCauldronPopup && (
  <div className="absolute left-1/2 top-28 z-[100] w-[390px] -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>Woofdows Repair Wizard</span>

      <button
        type="button"
        onClick={() => setShowCauldronPopup(false)}
        className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
      >
        ×
      </button>
    </div>

    <div className="flex items-center gap-4 px-5 py-5">
      <img
        src={`${import.meta.env.BASE_URL}warning_icon.png`}
        alt="Warning"
        className="h-11 w-11 object-contain"
        draggable="false"
      />

      <p className="flex-1 text-base">
        {cauldronPopupStep === "needCauldron"
          ? "So....you need a cauldron to proceed with the repair process"
          : "idk bro look it up or something"}
      </p>
    </div>

    <div className="flex justify-center pb-4">
      {cauldronPopupStep === "needCauldron" ? (
        <button
          type="button"
          onClick={() => setCauldronPopupStep("lookItUp")}
          className="min-w-36 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
        >
          where do i get one?
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
  setShowCauldronPopup(false);
  setInternetUnlocked(true);
}}
          className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
        >
          OK
        </button>
      )}
    </div>
  </div>
)}

{lockedAppPopup && (
  <div className="absolute left-1/2 top-28 z-[100] w-80 -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[3px_3px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>{lockedAppPopup.name}</span>

      <button
        type="button"
        onClick={() => setLockedAppPopup(null)}
        className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
      >
        ×
      </button>
    </div>

    <div className="flex items-center gap-4 px-4 py-5">
      <img
        src={`${import.meta.env.BASE_URL}${lockedAppPopup.image}`}
        alt={lockedAppPopup.name}
        className="h-12 w-12 object-contain"
        draggable="false"
      />

      <p className="text-lg">wait until later...</p>
    </div>

    <div className="flex justify-end px-3 pb-3">
      <button
        type="button"
        onClick={() => setLockedAppPopup(null)}
        className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
      >
        OK
      </button>
    </div>
  </div>
)}

{showShutdownPopup && (
  <div className="absolute left-1/2 top-28 z-[120] w-[360px] -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>Woofdows Shutdown</span>

      {shutdownStep !== "shutting" && (
        <button
          type="button"
          onClick={() => setShowShutdownPopup(false)}
          className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
        >
          ×
        </button>
      )}
    </div>

    {shutdownStep === "confirm" && (
      <>
        <div className="px-5 py-6 text-center text-lg">
          would you like to shut down pc?
        </div>

        <div className="flex justify-center gap-3 pb-4">
          <button
            type="button"
            onClick={confirmShutdown}
            className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() => setShutdownStep("noMessage")}
            className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
          >
            No
          </button>
        </div>
      </>
    )}

    {shutdownStep === "shutting" && (
      <div className="flex flex-col items-center px-5 py-8">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#808080] border-t-[#000080]" />
        <p className="text-lg">shutting down...</p>
      </div>
    )}

    {shutdownStep === "noMessage" && (
      <>
        <div className="px-5 py-6 text-center text-base">
          click the start button in the bottom left to shut down anytime
        </div>

        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={() => setShowShutdownPopup(false)}
            className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
          >
            OK
          </button>
        </div>
      </>
    )}
  </div>
)}

{showFinalMessagePopup && (
  <div className="absolute left-1/2 top-24 z-[90] w-80 -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[3px_3px_0_#000]">
    <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
      <span>Woofdows Message</span>

      <button
        type="button"
        onClick={() => setShowFinalMessagePopup(false)}
        className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
      >
        ×
      </button>
    </div>

    <div className="flex items-center gap-4 px-4 py-5">
      <img
        src={`${import.meta.env.BASE_URL}messages_icon_unread.png`}
        alt="Message"
        className="h-12 w-12 object-contain"
        draggable="false"
      />

      <p className="text-lg">You have one new message!</p>
    </div>

    <div className="flex justify-end px-3 pb-3">
      <button
        type="button"
        onClick={() => setShowFinalMessagePopup(false)}
        className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
      >
        OK
      </button>
    </div>
  </div>
)}

      {showSecondMessagePopup && (
        <div className="absolute left-1/2 top-24 z-[90] w-80 -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
            <span>Woofdows Message</span>
            <button
              type="button"
              onClick={() => {
  setShowSecondMessagePopup(false);
  setSecondMessageReady(true);
}}
              className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4 px-4 py-5">
            <img
              src={`${import.meta.env.BASE_URL}messages_icon_unread.png`}
              alt="Message"
              className="h-12 w-12 object-contain"
              draggable="false"
            />

            <p className="text-lg">You have one message.</p>
          </div>

          <div className="flex justify-end px-3 pb-3">
            <button
              type="button"
              onClick={() => {
  setShowSecondMessagePopup(false);
  setSecondMessageReady(true);
}}
              className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {messagesWindowIsOpen && (
  <MessageWindow
    key={messagesMode}
    mode={messagesMode}
    onClose={() => {
      closeApp("messages");

      if (messagesMode === "final") {
        setTimeout(() => {
          setShowShutdownPopup(true);
          setShutdownStep("confirm");
        }, 1000);
      }
    }}
    onLetterClick={startLetterChaos}
  />
)}

      {mailWindowIsOpen && (
  <MailWindow
    onClose={() => closeApp("mail")}
    collectedPieces={collectedPieces}
    setCollectedPieces={setCollectedPieces}
  />
)}

{photosWindowIsOpen && (
  <PhotosWindow
    onClose={() => closeApp("photos")}
    collectedPieces={collectedPieces}
    setCollectedPieces={setCollectedPieces}
  />
)}

{inventoryWindowIsOpen && (
  <InventoryWindow
    onClose={() => closeApp("inventory")}
    collectedPieces={collectedPieces}
    onOpenInstructions={() => {
      closeApp("inventory");
      setShowInstructionsImage(true);
    }}
  />
)}

{musicWindowIsOpen && (
  <MusicWindow
    onClose={() => closeApp("music")}
    collectedPieces={collectedPieces}
    setCollectedPieces={setCollectedPieces}
  />
)}

{filesWindowIsOpen && (
  <FilesWindow
    onClose={() => closeApp("files")}
    collectedPieces={collectedPieces}
    setCollectedPieces={setCollectedPieces}
  />
)}

{internetWindowIsOpen && (
  <InternetWindow
    onClose={() => closeApp("internet")}
    onDownloadComplete={() => {
      closeApp("internet");
      setCauldronAppUnlocked(true);
    }}
  />
)}

{cauldronWindowIsOpen && (
  <CauldronWindow
    onClose={() => closeApp("cauldron")}
    onLetterFixed={() => {
  playSound("dreamy.mp3", 0.7);
  setLetterIsFixed(true);
  setFinalMessageReady(true);
  setMessagesClicked(false);
  setShowFinalMessagePopup(true);
}}
    onFinished={() => {
      closeApp("cauldron");
    }}
  />
)}

      {showLetterChaos && <LetterChaosOverlay onClose={finishLetterChaos} />}

      {showFixPopup && (
        <div className="absolute left-1/2 top-[58%] z-[95] w-[360px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
  <span>Woofdows Warning</span>

  <span className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black">
    ×
  </span>
</div>

          <div className="flex items-center gap-4 px-5 py-5 text-base">
  <img
    src={`${import.meta.env.BASE_URL}warning_icon.png`}
    alt="Warning"
    className="h-10 w-10 object-contain"
    draggable="false"
  />

  <p className="flex-1 text-center">
    {fixPopupStep === "warning"
      ? "bro... you better fix this before she finds out"
      : "Go find the pieces! They've all scattered into your desktop somewhere"}
  </p>
</div>

          <div className="flex justify-center pb-4">
            {fixPopupStep === "warning" ? (
              <button
                type="button"
                onClick={() => setFixPopupStep("explain")}
                className="min-w-32 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                what do you mean?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowFixPopup(false);
                  setShowSecondMessagePopup(false);
                  closeApp("messages");
                }}
                className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 z-40 flex h-11 w-full items-center border-t-2 border-[#f5f5f5] bg-[#c0c0c0] px-1 shadow-[inset_0_1px_#ffffff]">
        <button
  type="button"
  onClick={startShutdown}
  className="mr-2 flex h-8 items-center gap-1 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-3 text-sm font-bold text-black shadow-[1px_1px_0_#000]"
>
          <img
            src={`${import.meta.env.BASE_URL}dog_logo_black.png`}
            alt="Start"
            className="h-10 w-10 object-contain"
            draggable="false"
          />
          Start
        </button>

        <div className="mr-2 h-8 border-l border-[#808080] border-r border-[#ffffff]" />

        <div className="flex flex-1 items-center gap-1 overflow-hidden">
          {openWindows.map((window) => (
            <button
              key={window.id}
              type="button"
              className="flex h-8 min-w-[140px] max-w-[190px] items-center gap-2 overflow-hidden border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#d4d0c8] px-2 text-left text-sm text-black shadow-[1px_1px_0_#000]"
            >
              <img
                src={`${import.meta.env.BASE_URL}${window.image}`}
                alt=""
                className="h-5 w-5 object-contain"
                draggable="false"
              />
              <span className="truncate">{window.name}</span>
            </button>
          ))}
        </div>

        <div className="ml-2 flex h-8 items-center border-2 border-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-[#c0c0c0] px-3 text-sm text-black">
          12:00 PM
        </div>
      </div>
    </div>
  );
}

function MessageWindow({ onClose, onLetterClick, mode = "normal" }) {
  const [position, setPosition] = useState({ x: 330, y: 110 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [finalChatDone, setFinalChatDone] = useState(false);
  const [messages, setMessages] = useState(
  mode === "afterBreak" || mode === "final"
    ? [
        {
          sender: "friend",
          type: "text",
          text: "so did you read it yet? :3",
        },
      ]
    : [
        {
          sender: "friend",
          type: "text",
          text: "hewwo",
        },
      ]
);
  const [replyText, setReplyText] = useState("");
  const [replyCount, setReplyCount] = useState(0);
  const [friendIsTyping, setFriendIsTyping] = useState(false);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function addFriendMessages(newMessages) {
    setFriendIsTyping(true);

    newMessages.forEach((newMessage, index) => {
      setTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, newMessage]);

        if (index === newMessages.length - 1) {
          setFriendIsTyping(false);
        }
      }, 900 + index * 1400);
    });
  }

  function handleSendReply(event) {
    event.preventDefault();

    const trimmedReply = replyText.trim();

    if (trimmedReply === "") {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: "user",
        type: "text",
        text: trimmedReply,
      },
    ]);

    setReplyText("");

    const nextReplyCount = replyCount + 1;
    setReplyCount(nextReplyCount);

    if (mode === "final") {
  if (nextReplyCount === 1) {
    addFriendMessages([
      {
        sender: "friend",
        type: "text",
        text: "I hope you like it",
      },
    ]);
  }

  if (nextReplyCount === 2) {
    addFriendMessages([
      {
        sender: "friend",
        type: "text",
        text: ":)",
      },
    ]);

    setFinalChatDone(true);
  }

  return;
}

    if (nextReplyCount === 1) {
      addFriendMessages([
        {
          sender: "friend",
          type: "text",
          text: "wrow",
        },
        {
          sender: "friend",
          type: "text",
          text: "happy first anniversary :)",
        },
      ]);
    }

    if (nextReplyCount === 2) {
      addFriendMessages([
        {
          sender: "friend",
          type: "text",
          text: "I wrote you a letter :3",
        },
        {
          sender: "friend",
          type: "text",
          text: "wanna see?",
        },
      ]);
    }

    if (nextReplyCount === 3) {
      addFriendMessages([
        {
          sender: "friend",
          type: "file",
          text: "letter.txt",
          image: "txt_file_icon.png",
        },
      ]);
    }
  }

  return (
    <div
      className="absolute z-50 w-[430px] border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white"
      >
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}messages_icon.png`}
            alt=""
            className="h-5 w-5 object-contain"
            draggable="false"
          />
          <span>Messages</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          onMouseDown={(event) => event.stopPropagation()}
          className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
        >
          ×
        </button>
      </div>

      <div className="border-2 border-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white">
        <div className="border-b border-[#808080] bg-[#e7e7e7] px-3 py-2 text-sm">
          Chat with Harsa
        </div>

        <div className="flex h-[330px] flex-col gap-3 overflow-y-auto bg-[#f5f5f5] p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "friend" && (
                <img
                  src={`${import.meta.env.BASE_URL}friend_pfp.png`}
                  alt="Friend"
                  className="h-8 w-8 rounded-full object-cover"
                  draggable="false"
                />
              )}

              {message.type === "text" && (
                <div
                  className={`max-w-[260px] rounded px-3 py-2 text-sm shadow ${
                    message.sender === "user"
                      ? "bg-[#c7ddff] text-black"
                      : "bg-white text-black"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {message.type === "file" && (
                <button
                  type="button"
                  onClick={onLetterClick}
                  className="flex w-28 flex-col items-center rounded bg-white px-3 py-3 text-sm shadow hover:bg-blue-100"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${message.image}`}
                    alt={message.text}
                    className="h-14 w-14 object-contain"
                    draggable="false"
                  />
                  <span className="mt-1 text-center">{message.text}</span>
                </button>
              )}

              {message.sender === "user" && (
                <img
                  src={`${import.meta.env.BASE_URL}profile_photo_andrew.png`}
                  alt="Andrew"
                  className="h-8 w-8 rounded-full object-cover"
                  draggable="false"
                />
              )}
            </div>
          ))}

          {friendIsTyping && (
            <div className="flex items-end gap-2 justify-start">
              <img
                src={`${import.meta.env.BASE_URL}friend_pfp.png`}
                alt="Friend"
                className="h-8 w-8 rounded-full object-cover"
                draggable="false"
              />
              <div className="rounded bg-white px-3 py-2 text-sm shadow">
                typing...
              </div>
            </div>
          )}
        </div>

        {mode !== "afterBreak" && !(mode === "final" && finalChatDone) && (
          <form
            onSubmit={handleSendReply}
            className="flex gap-2 border-t border-[#808080] bg-[#d4d0c8] p-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Type a message..."
              className="flex-1 border-2 border-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white px-2 py-1 text-sm text-black outline-none"
            />

            <button
              type="submit"
              className="border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function MailWindow({ onClose, collectedPieces, setCollectedPieces }) {
  const [position, setPosition] = useState({ x: 220, y: 70 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedMailId, setSelectedMailId] = useState(1);

  const mails = [
    {
      id: 1,
      from: "#1 Electronics Company",
      subject: "We would like to sponsor you",
      date: "Today",
      body: "Hello, is this Drew from Baja Spartan Racing? We saw your email. We would love to sponsor you! Let's meet sometime so we can discuss details. Sincerely, #1 Electronics Company Worldwide."
    },
      {
      id: 2,
      from: "Habor Freight",
      subject: "New Harbor Freight Deals!!",
      date: "Yesterday",
      body: "NEW DEALS. MORE SAVINGS. Andrew, explore ways to save at Harbor Freight. Do you like tools and stuff? Well we've got all that! Buy all the stuff you want on 50% discount, valid from today until Wednesday. That's right! All your faborite things, on sale.",
    },
    {
      id: 3,
      from: "John Insurance",
      subject: "Your insurance is expired",
      date: "Monday",
      body: "Hello Drew, Your insurance is expired. Please send me your credit card details, SSN, as well as address so we can renew it. Thanks, John from your insurance company."
    },
    {
      id: 4,
      from: "Woofdows Team",
      subject: "Welcome to Woofdows Mail!",
      date: "Sunday",
      body: "Your new mail account is setup and all ready to go. Remember, don't open any suspicious files!",
    },
    {
      id: 5,
      from: "SUSPICIOUS",
      subject: "[redacted]",
      date: "???",
      body: "Do you want to win a million dollars???? yes??? click on the attachment below!!!! :D",
      hasPiece: true,
    },
  ];

  const selectedMail = mails.find((mail) => mail.id === selectedMailId);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  return (
    <div
      className="absolute z-50 w-[850px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}mail_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>Inbox - Microsoft Outlook</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Tools</span>
        <span>Actions</span>
        <span>Help</span>
      </div>

      <div className="flex h-8 items-center gap-1 border-b border-[#9c9c9c] bg-[#ece9d8] px-1 text-xs">
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          New
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Reply
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Forward
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Send/Receive
        </button>

        <div className="mx-1 h-6 border-l border-[#888]" />

        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Find
        </button>

        <div className="ml-auto flex items-center gap-1">
          <input
            readOnly
            value="Type a question for help"
            className="h-5 w-36 border border-[#7f9db9] bg-white px-1 text-[11px] text-[#777]"
          />
          <input
            readOnly
            value="Type a contact to find"
            className="h-5 w-40 border border-[#7f9db9] bg-white px-1 text-[11px] text-[#777]"
          />
        </div>
      </div>

      <div className="flex h-[500px] bg-[#9aa7b8]">
        <div className="flex h-full w-[185px] flex-col border-r border-[#6f7c8e] bg-[#d8e7fb]">
          <div className="bg-gradient-to-r from-[#1f5fbf] to-[#74a8f5] px-2 py-1 text-sm font-bold text-white">
            Mail
          </div>

          <div className="p-2 text-xs">
            <div className="mb-2 rounded border border-[#9eb6d8] bg-white">
              <div className="bg-[#d6e8ff] px-2 py-1 font-bold">
                Favorite Folders
              </div>
              <div className="px-3 py-1">📥 Inbox</div>
              <div className="px-3 py-1">📄 Unread Mail</div>
              <div className="px-3 py-1">🚩 For Follow Up</div>
              <div className="px-3 py-1">✉️ Sent Items</div>
            </div>

            <div className="rounded border border-[#9eb6d8] bg-white">
              <div className="bg-[#d6e8ff] px-2 py-1 font-bold">
                All Mail Folders
              </div>
              <div className="px-3 py-1">▾ Personal Folders</div>
              <div className="px-6 py-1">Deleted Items</div>
              <div className="bg-[#316ac5] px-6 py-1 text-white">Inbox</div>
              <div className="px-6 py-1">Junk E-mail</div>
              <div className="px-6 py-1">Outbox</div>
              <div className="px-6 py-1">Sent Items</div>
            </div>
          </div>

          <div className="mt-auto border-t border-[#8ba8d8]">
            <div className="bg-gradient-to-r from-[#ff9d00] to-[#ffe2a6] px-3 py-2 text-sm font-bold">
              Mail
            </div>
            <div className="border-t border-[#8ba8d8] bg-[#a7c7f2] px-3 py-2 text-sm">
              Calendar
            </div>
            <div className="border-t border-[#8ba8d8] bg-[#a7c7f2] px-3 py-2 text-sm">
              Contacts
            </div>
            <div className="border-t border-[#8ba8d8] bg-[#a7c7f2] px-3 py-2 text-sm">
              Tasks
            </div>
          </div>
        </div>

        <div className="h-full w-[250px] border-r border-[#6f7c8e] bg-white">
          <div className="flex h-6 items-center border-b border-[#aca899] bg-[#ece9d8] px-2 text-xs font-bold">
            Inbox
          </div>

          {mails.map((mail) => (
            <button
              key={mail.id}
              type="button"
              onClick={() => setSelectedMailId(mail.id)}
              className={`block w-full border-b border-[#ddd] px-2 py-2 text-left text-xs ${
                selectedMailId === mail.id
                  ? "bg-[#316ac5] text-white"
                  : "bg-white text-black hover:bg-[#e8f0ff]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{mail.from}</span>
                <span className="opacity-80">{mail.date}</span>
              </div>
              <div className="mt-1 truncate">{mail.subject}</div>
            </button>
          ))}
        </div>

        <div className="flex h-full flex-1 flex-col bg-white">
          <div className="border-b border-[#aca899] bg-[#f3f3f3] px-3 py-2">
            <p className="text-sm font-bold">{selectedMail.subject}</p>
            <p className="mt-1 text-xs">
              <span className="font-bold">From:</span> {selectedMail.from}
            </p>
            <p className="text-xs">
              <span className="font-bold">Date:</span> {selectedMail.date}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 text-sm leading-relaxed">
            <p>{selectedMail.body}</p>

            {selectedMail.hasPiece && !collectedPieces.includes("piece1") && (
  <div className="mt-40 border border-dashed border-[#777] bg-[#fffbe6] p-4 text-center">
    <p className="mb-3 text-xs font-bold">
      Suspicious attachment:
    </p>

    <button
      type="button"
      onClick={() => {
        setCollectedPieces((currentPieces) => [...currentPieces, "piece1"]);
      }}
      className="inline-flex flex-col items-center rounded px-3 py-2 hover:bg-[#d6e8ff]"
    >
      <img
        src={`${import.meta.env.BASE_URL}broken_file_1.png`}
        alt="Letter piece"
        className="h-20 w-20 object-contain"
        draggable="false"
      />
      <span className="mt-1 text-xs">letter_piece_1.png</span>
    </button>
  </div>
)}
          </div>
        </div>
      </div>

      
    </div>
  );
}

function PhotosWindow({ onClose, collectedPieces, setCollectedPieces }) {
  const [position, setPosition] = useState({ x: 250, y: 80 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedPhotoId, setSelectedPhotoId] = useState(1);


  const photos = [
    {
      id: 1,
      name: "photo_1.png",
      image: "photo_1.png",
    },
    {
      id: 2,
      name: "photo_2.png",
      image: "photo_2.png",
    },
    {
      id: 3,
      name: "photo_3.png",
      image: "photo_3.png",
    },
    {
      id: 4,
      name: "photo_4.png",
      image: "photo_4.png",
    },
    {
      id: 5,
      name: "photo_5.png",
      image: "photo_5.png",
    },
    {
      id: 6,
      name: "photo_6.png",
      image: "photo_6.png",
    },
  ];

  const selectedPhoto = photos.find((photo) => photo.id === selectedPhotoId);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  return (
    <div
      className="absolute z-50 w-[780px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}photos_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>My Pictures</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="flex h-8 items-center gap-1 border-b border-[#9c9c9c] bg-[#ece9d8] px-1 text-xs">
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Back
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Search
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Folders
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Views
        </button>

        <div className="ml-auto flex items-center gap-1">
          <span>Address</span>
          <input
            readOnly
            value="C:\My Documents\My Pictures"
            className="h-5 w-64 border border-[#7f9db9] bg-white px-1 text-[11px] text-[#333]"
          />
        </div>
      </div>

      <div className="flex h-[460px] bg-white">
        <div className="w-[210px] border-r border-[#7f9db9] bg-[#d8e7fb] p-2 text-xs">
          <div className="mb-3 rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Picture Tasks
            </div>
            <div className="px-3 py-2">View as a slide show</div>
            <div className="px-3 py-2">Order prints online</div>
            <div className="px-3 py-2">Print pictures</div>
            <div className="px-3 py-2">Copy all items to CD</div>
          </div>

          <div className="rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Other Places
            </div>
            <div className="px-3 py-2">My Documents</div>
            <div className="px-3 py-2">Shared Pictures</div>
            <div className="px-3 py-2">My Computer</div>
          </div>
        </div>

        <div className="w-[330px] overflow-y-auto border-r border-[#7f9db9] bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhotoId(photo.id)}
                className={`flex flex-col items-center rounded border p-2 text-xs ${
                  selectedPhotoId === photo.id
                    ? "border-[#316ac5] bg-[#dbeaff]"
                    : "border-transparent bg-white hover:border-[#b8d6fb] hover:bg-[#eef5ff]"
                }`}
              >
                <div className="flex h-24 w-28 items-center justify-center border border-[#b5b5b5] bg-white p-1 shadow">
                  <img
                    src={`${import.meta.env.BASE_URL}${photo.image}`}
                    alt={photo.name}
                    className="max-h-full max-w-full object-contain"
                    draggable="false"
                  />
                </div>
                <span className="mt-2 text-center">{photo.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-[#f4f4f4]">
          <div className="border-b border-[#aca899] bg-[#ece9d8] px-3 py-2 text-sm font-bold">
            Preview
          </div>

          <div className="flex flex-1 items-center justify-center p-5">
            <div className="relative flex h-[330px] w-[330px] items-center justify-center border border-[#999] bg-white p-3 shadow-inner">
  <img
    src={`${import.meta.env.BASE_URL}${selectedPhoto.image}`}
    alt={selectedPhoto.name}
    className="max-h-full max-w-full object-contain"
    draggable="false"
  />

  {selectedPhoto.id === 4 && !collectedPieces.includes("piece2") && (
  <button
    type="button"
    onClick={() => {
      setCollectedPieces((currentPieces) => [...currentPieces, "piece2"]);
    }}
    className="absolute top-15 right-5 rounded px-1 py-1 hover:bg-[#dbeaff]"
    title="Letter piece"
  >
    <img
      src={`${import.meta.env.BASE_URL}broken_file_2.png`}
      alt="Hidden letter piece"
      className="h-10 w-10 object-contain"
      draggable="false"
    />
  </button>
)}
</div>
          </div>

          <div className="border-t border-[#aca899] bg-[#ece9d8] px-3 py-2 text-xs">
            {selectedPhoto.name}
          </div>
        </div>
      </div>

      <div className="flex h-5 items-center border-t border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        6 objects
      </div>
    </div>
  );
}

function InventoryWindow({ onClose, collectedPieces, onOpenInstructions }) {
  const [position, setPosition] = useState({ x: 310, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const items = [
    {
      id: "piece1",
      name: "Letter Piece 1",
      image: "broken_file_1.png",
      hint: "Found in Mail",
    },
    {
      id: "piece2",
      name: "Letter Piece 2",
      image: "broken_file_2.png",
      hint: "Found in Photos",
    },
    {
      id: "piece3",
      name: "Letter Piece 3",
      image: "broken_file_3.png",
      hint: "Found in Music",
    },
    {
      id: "piece4",
      name: "Letter Piece 4",
      image: "broken_file_4.png",
      hint: "Found in Files",
    },
    {
      id: "mixingAgent",
      name: "Mixing Agent",
      image: "glue_bottle.png",
      hint: "Found in Trash",
    },
    {
      id: "recombineScroll",
      name: "Recombination Scroll",
      image: "scroll_icon.png",
      hint: "Found in Files",
    },
  ];

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  return (
    <div
      className="absolute z-50 w-[700px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}inventory_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>Inventory</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="flex h-8 items-center gap-1 border-b border-[#9c9c9c] bg-[#ece9d8] px-1 text-xs">
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Organize
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          View
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Refresh
        </button>

        <div className="ml-auto text-xs">
          {collectedPieces.length} / 6 items found
        </div>
      </div>

      <div className="flex h-[420px] bg-white">
        <div className="w-[180px] border-r border-[#7f9db9] bg-[#d8e7fb] p-2 text-xs">
          <div className="mb-3 rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Letter Tasks
            </div>
            <div className="px-3 py-2">Find letter pieces</div>
            <div className="px-3 py-2">Find mixing agent</div>
            <div className="px-3 py-2">Find scroll</div>
            <div className="px-3 py-2">Repair letter</div>
          </div>

          <div className="rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Status
            </div>
            <div className="px-3 py-2">
              {collectedPieces.length === 6
                ? "Ready to repair!"
                : "Items missing"}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-5">
          <p className="mb-4 text-lg font-bold">Repair Inventory</p>

          <div className="grid grid-cols-2 gap-4">
  {items.map((item) => {
    const isCollected = collectedPieces.includes(item.id);

    const allItemsCollected = items.every((inventoryItem) =>
      collectedPieces.includes(inventoryItem.id)
    );

    const scrollIsClickable =
      item.id === "recombineScroll" && allItemsCollected;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          if (scrollIsClickable) {
            onOpenInstructions();
          }
        }}
        className={`flex items-center gap-4 rounded border p-3 text-left ${
          isCollected
            ? "border-[#7f9db9] bg-[#eef5ff]"
            : "border-[#c0c0c0] bg-[#eeeeee]"
        } ${
          scrollIsClickable
            ? "cursor-pointer hover:bg-[#dbeaff]"
            : "cursor-default"
        }`}
      >
        <div className="flex h-20 w-20 items-center justify-center border border-[#aaa] bg-white">
          {isCollected ? (
            <img
              src={`${import.meta.env.BASE_URL}${item.image}`}
              alt={item.name}
              className="h-16 w-16 object-contain"
              draggable="false"
            />
          ) : (
            <span className="text-4xl text-[#777]">?</span>
          )}
        </div>

        <div>
          <p className="font-bold">{item.name}</p>
          <p className="mt-1 text-xs text-[#555]">
            {isCollected
              ? scrollIsClickable
                ? "Click to view instructions"
                : item.hint
              : "Not collected yet"}
          </p>
        </div>
      </button>
    );
  })}
</div>

          {collectedPieces.length === 6 && (
            <div className="mt-5 rounded border border-[#7f9db9] bg-[#fffbe6] p-3 text-center text-sm font-bold">
              All repair items found. Click on recombination scroll to see process.
            </div>
          )}
        </div>
      </div>

      <div className="flex h-5 items-center border-t border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        Inventory ready
      </div>
    </div>
  );
}

function MusicWindow({ onClose, collectedPieces, setCollectedPieces }) {
  const [position, setPosition] = useState({ x: 290, y: 95 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedSongId, setSelectedSongId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioElement, setAudioElement] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const songs = [
  {
    id: 1,
    title: "cyan_hardcore.mp3",
    artist: "machine girl",
    length: "5:06",
    file: "song_1.mp3",
  },
  {
    id: 2,
    title: "not_allowed.mp3",
    artist: "tv girl",
    length: "2:45",
    file: "song_2.mp3",
  },
  {
    id: 3,
    title: "ventura_highway.mp3",
    artist: "america, george martin",
    length: "3:32",
    file: "song_3.mp3",
  },
  {
    id: 4,
    title: "the_moon_cave.mp3",
    artist: "gorillaz",
    length: "4:59",
    file: "song_4.mp3",
  },
];

  const selectedSong = songs.find((song) => song.id === selectedSongId);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  useEffect(() => {
  if (!audioElement) return;

  function updateProgress() {
    setElapsedSeconds(Math.floor(audioElement.currentTime || 0));
    setDurationSeconds(Math.floor(audioElement.duration || 0));
  }

  function handleLoadedMetadata() {
    setDurationSeconds(Math.floor(audioElement.duration || 0));
  }

  function handleEnded() {
    setIsPlaying(false);
    setElapsedSeconds(0);
    audioElement.currentTime = 0;
  }

  audioElement.addEventListener("timeupdate", updateProgress);
  audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
  audioElement.addEventListener("ended", handleEnded);

  return () => {
    audioElement.removeEventListener("timeupdate", updateProgress);
    audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.removeEventListener("ended", handleEnded);
  };
}, [audioElement]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function selectSong(songId) {
  if (audioElement) {
    audioElement.pause();
  }

  setSelectedSongId(songId);
  setElapsedSeconds(0);
  setIsPlaying(false);
  setAudioElement(null);
}

  function collectMusicPiece() {
    setCollectedPieces((currentPieces) => {
      if (currentPieces.includes("piece3")) {
        return currentPieces;
      }

      return [...currentPieces, "piece3"];
    });
  }

  function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

  const shouldShowHiddenPiece =
    selectedSongId === 2 &&
    elapsedSeconds >= 10 &&
    !collectedPieces.includes("piece3");

  return (
    <div
      className="absolute z-50 w-[610px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}music_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>Windows Media Player</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>View</span>
        <span>Play</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="flex h-[390px] bg-[#0f172a]">
        <div className="flex w-[250px] flex-col border-r border-[#4b5563] bg-[#d8e7fb]">
          <div className="bg-gradient-to-r from-[#1f5fbf] to-[#74a8f5] px-3 py-2 text-sm font-bold text-white">
            Now Playing List
          </div>

          <div className="flex-1 bg-white">
            {songs.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => selectSong(song.id)}
                className={`block w-full border-b border-[#ddd] px-3 py-3 text-left text-xs ${
                  selectedSongId === song.id
                    ? "bg-[#316ac5] text-white"
                    : "bg-white text-black hover:bg-[#e8f0ff]"
                }`}
              >
                <div className="font-bold">{song.title}</div>
                <div className="mt-1 flex justify-between opacity-80">
                  <span>{song.artist}</span>
                  <span>{song.length}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-[#1d4ed8] via-[#111827] to-[#020617]">
            <div className="text-center text-white">
              <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#93c5fd] bg-black shadow-[0_0_25px_rgba(147,197,253,0.7)]">
                <span className="text-5xl">♪</span>
              </div>

              <p className="text-lg font-bold">{selectedSong.title}</p>
              <p className="mt-1 text-sm text-blue-100">{selectedSong.artist}</p>

              <p className="mt-4 font-mono text-xl">
  {formatTime(elapsedSeconds)} / {formatTime(durationSeconds)}
</p>
            </div>

            {shouldShowHiddenPiece && (
              <button
                type="button"
                onClick={collectMusicPiece}
                className="absolute bottom-5 left-5 rounded bg-white/20 p-2 hover:bg-white/40"
                title="Letter piece"
              >
                <img
                  src={`${import.meta.env.BASE_URL}broken_file_3.png`}
                  alt="Hidden letter piece"
                  className="h-12 w-12 object-contain"
                  draggable="false"
                />
              </button>
            )}
          </div>

          <div className="border-t border-[#9c9c9c] bg-[#ece9d8] p-3">
            <div className="mb-2 h-3 rounded border border-[#7f9db9] bg-white">
              <div
                className="h-full bg-[#316ac5]"
                style={{
  width: `${
    durationSeconds > 0
      ? Math.min((elapsedSeconds / durationSeconds) * 100, 100)
      : 0
  }%`,
}}
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
  if (audioElement) {
    audioElement.currentTime = 0;
  }

  setElapsedSeconds(0);
}}
                className="h-8 min-w-10 border border-[#aca899] bg-[#f8f8f8] px-2 text-xs"
              >
                ⏮
              </button>

              <button
  type="button"
  onClick={() => {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    const audio =
      audioElement ||
      new Audio(`${import.meta.env.BASE_URL}${selectedSong.file}`);

    audio.play().catch(() => {
      console.log("Music could not play.");
    });

    setAudioElement(audio);
    setIsPlaying(true);
  }}
  className="h-9 min-w-20 rounded border border-[#3b82f6] bg-gradient-to-b from-[#dbeafe] to-[#60a5fa] px-3 text-sm font-bold"
>
  {isPlaying ? "Pause" : "Play"}
</button>

              <button
                type="button"
                onClick={() => {
  if (audioElement) {
    audioElement.currentTime = Math.min(
      audioElement.currentTime + 5,
      audioElement.duration || audioElement.currentTime + 5
    );
  }
}}
                className="h-8 min-w-10 border border-[#aca899] bg-[#f8f8f8] px-2 text-xs"
              >
                ⏭
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-5 items-center border-t border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        {collectedPieces.includes("piece3")
          ? "Hidden item collected"
          : "Windows Media Player ready"}
      </div>
    </div>
  );
}

function FilesWindow({ onClose, collectedPieces, setCollectedPieces }) {
  const [position, setPosition] = useState({ x: 260, y: 75 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentFolder, setCurrentFolder] = useState("root");

  const rootItems = [
    { id: "documents", name: "Documents", type: "folder", clickable: false },
    { id: "homework", name: "Homework", type: "folder", clickable: false },
    { id: "taxes", name: "Taxes 2009", type: "folder", clickable: false },
    { id: "corn", name: "corn", type: "folder", clickable: true },
    { id: "secret", name: "secret_stuff", type: "folder", clickable: false },
    { id: "readme", name: "baja", type: "file", clickable: false },
    { id: "virus", name: "totally_not_a_virus.exe", type: "file", clickable: false },
    { id: "notes", name: "notes.txt", type: "file", clickable: false },
  ];

  const cornItems = [
    {
      id: "piece4",
      name: "letter_piece_4.png",
      image: "broken_file_4.png",
      type: "collectible",
    },
    {
      id: "recombineScroll",
      name: "recombination_scroll.png",
      image: "scroll_icon.png",
      type: "collectible",
    },
  ];

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function collectItem(itemId) {
    setCollectedPieces((currentItems) => {
      if (currentItems.includes(itemId)) {
        return currentItems;
      }

      return [...currentItems, itemId];
    });
  }

  function getFileIcon(item) {
    if (item.type === "folder") {
      return "files_icon.png";
    }

    if (item.type === "collectible") {
      return item.image;
    }

    if (item.name.endsWith(".exe")) {
      return "virus.png";
    }

    return "txt_file.png";
  }

  const visibleItems = currentFolder === "root" ? rootItems : cornItems;

  return (
    <div
      className="absolute z-50 w-[760px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}files_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>{currentFolder === "root" ? "My Documents" : "corn :lipbite:"}</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="flex h-8 items-center gap-1 border-b border-[#9c9c9c] bg-[#ece9d8] px-1 text-xs">
        <button
          type="button"
          onClick={() => setCurrentFolder("root")}
          disabled={currentFolder === "root"}
          className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2 disabled:opacity-50"
        >
          Back
        </button>

        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Search
        </button>

        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Folders
        </button>

        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Views
        </button>

        <div className="ml-auto flex items-center gap-1">
          <span>Address</span>
          <input
            readOnly
            value={
              currentFolder === "root"
                ? "C:\\Documents and Settings\\Andrew\\My Documents"
                : "C:\\Documents and Settings\\Andrew\\My Documents\\corn :lipbite:"
            }
            className="h-5 w-80 border border-[#7f9db9] bg-white px-1 text-[11px] text-[#333]"
          />
        </div>
      </div>

      <div className="flex h-[430px] bg-white">
        <div className="w-[210px] border-r border-[#7f9db9] bg-[#d8e7fb] p-2 text-xs">
          <div className="mb-3 rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              File and Folder Tasks
            </div>
            <div className="px-3 py-2">Make a new folder</div>
            <div className="px-3 py-2">Publish this folder</div>
            <div className="px-3 py-2">Share this folder</div>
          </div>

          <div className="mb-3 rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Other Places
            </div>
            <div className="px-3 py-2">Desktop</div>
            <div className="px-3 py-2">My Computer</div>
            <div className="px-3 py-2">My Pictures</div>
          </div>

          <div className="rounded border border-[#9eb6d8] bg-white">
            <div className="bg-gradient-to-r from-[#2d69c7] to-[#8ab6ff] px-2 py-1 font-bold text-white">
              Details
            </div>
            <div className="px-3 py-2">
              {currentFolder === "root"
                ? "My Documents"
                : "2 important objects"}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-5">
          <div className="grid grid-cols-4 gap-x-6 gap-y-7">
            {visibleItems.map((item) => {
              const isCollected =
                item.type === "collectible" && collectedPieces.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onDoubleClick={() => {
                    if (item.id === "corn") {
                      setCurrentFolder("corn");
                    }
                  }}
                  onClick={() => {
                    if (item.type === "collectible") {
                      collectItem(item.id);
                    }
                  }}
                  className={`flex min-h-[105px] flex-col items-center rounded border border-transparent px-2 py-2 text-xs hover:border-[#b8d6fb] hover:bg-[#eef5ff] ${
                    item.clickable || item.type === "collectible"
                      ? "cursor-pointer"
                      : "cursor-default opacity-80"
                  }`}
                >
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    {isCollected ? (
                      <div className="flex h-14 w-14 items-center justify-center rounded border border-[#aaa] bg-[#eee] text-2xl text-[#777]">
                        ✓
                      </div>
                    ) : (
                      <img
                        src={`${import.meta.env.BASE_URL}${getFileIcon(item)}`}
                        alt=""
                        className="max-h-16 max-w-16 object-contain"
                        draggable="false"
                      />
                    )}
                  </div>

                  <span className="mt-2 max-w-[95px] break-words text-center leading-tight">
                    {isCollected ? `${item.name} collected` : item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {currentFolder === "root" && (
            <p className="mt-8 text-xs text-[#555]">
              Only one folder seems willing to open.
            </p>
          )}

          {currentFolder === "corn" && (
            <p className="mt-8 text-xs text-[#555]">
              Click the items to add them to Inventory.
            </p>
          )}
        </div>
      </div>

      <div className="flex h-5 items-center border-t border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        {currentFolder === "root"
          ? `${rootItems.length} objects`
          : `${cornItems.length} objects`}
      </div>
    </div>
  );
}

function InternetWindow({ onClose, onDownloadComplete }) {
  const [position, setPosition] = useState({ x: 210, y: 65 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    function handleMouseMove(event) {
      if (!dragging) return;

      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);

  function startDragging(event) {
    setDragging(true);

    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function startDownload() {
    if (isDownloading) return;

    setIsDownloading(true);

    setTimeout(() => {
      onDownloadComplete();
    }, 4000);
  }

  const adImages = [
  "ad_1.png",
  "ad_2.png",
  "ad_3.png",
  "ad_4.png",
  "ad_5.png",
  "ad_6.png",
];

  return (
    <div
      className="absolute z-50 w-[880px] border border-[#003c74] bg-[#d4d0c8] text-black shadow-[5px_5px_0_rgba(0,0,0,0.45)]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={startDragging}
        className="flex cursor-move select-none items-center justify-between bg-gradient-to-r from-[#0055e5] via-[#2f7df0] to-[#5aa7ff] px-1 py-[2px] text-sm font-bold text-white"
      >
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.BASE_URL}internet_icon.png`}
            alt=""
            className="h-4 w-4 object-contain"
            draggable="false"
          />
          <span>Internet Explorer</span>
        </div>

        <div className="flex gap-[2px]">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            _
          </button>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#003c74] bg-gradient-to-b from-[#d9ecff] to-[#3b8cff] text-xs font-bold text-white"
          >
            □
          </button>
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#7f1d1d] bg-gradient-to-b from-[#ffb0a4] to-[#e31b0c] text-xs font-bold text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex h-6 items-center gap-4 border-b border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="flex h-8 items-center gap-1 border-b border-[#9c9c9c] bg-[#ece9d8] px-1 text-xs">
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Back
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Forward
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Stop
        </button>
        <button className="h-6 border border-[#aca899] bg-[#f8f8f8] px-2">
          Refresh
        </button>

        <div className="ml-auto flex items-center gap-1">
          <span>Address</span>
          <input
            readOnly
            value="http://www.totally-legit-cauldron-download.biz"
            className="h-5 w-[420px] border border-[#7f9db9] bg-white px-1 text-[11px] text-[#333]"
          />
        </div>
      </div>

      <div className="h-[510px] overflow-y-auto bg-white p-3">
        <div className="grid grid-cols-[150px_1fr_150px] gap-3">
          <div className="mt-10 flex flex-col gap-3">
            {adImages.slice(0, 3).map((adImage) => (
  <img
    key={adImage}
    src={`${import.meta.env.BASE_URL}${adImage}`}
    alt="Ad"
    className="w-full border border-[#777] object-contain"
    draggable="false"
  />
))}
          </div>

          <div className="border border-[#999] bg-[#f5f5f5] p-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-purple-800">
              Witch Cauldron EXE
            </h1>

            <p className="mb-5 text-sm">
              Totally safe definitely not a virus official repair cauldron.
            </p>

            <div className="mx-auto mb-5 flex h-[260px] w-[320px] items-center justify-center bg-white p-4 shadow-inner">
              <img
                src={`${import.meta.env.BASE_URL}cauldron.png`}
                alt="Cauldron"
                className="max-h-full max-w-full object-contain"
                draggable="false"
              />
            </div>

            <button
              type="button"
              onClick={startDownload}
              disabled={isDownloading}
              className="border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-8 py-2 text-lg font-bold text-black shadow-[2px_2px_0_#000] disabled:opacity-70"
            >
              {isDownloading ? "downloading..." : "download"}
            </button>

            {isDownloading && (
              <div className="mx-auto mt-5 h-4 w-64 border border-[#7f9db9] bg-white">
                <div className="h-full animate-pulse bg-[#316ac5]" />
              </div>
            )}
          </div>

          <div className="mt-15 flex flex-col gap-3">
            {adImages.slice(3, 6).map((adImage) => (
  <img
    key={adImage}
    src={`${import.meta.env.BASE_URL}${adImage}`}
    alt="Ad"
    className="w-full border border-[#777] object-contain"
    draggable="false"
  />
))}
          </div>
        </div>
      </div>

      <div className="flex h-5 items-center border-t border-[#9c9c9c] bg-[#ece9d8] px-2 text-xs">
        Internet zone
      </div>
    </div>
  );
}

function CauldronWindow({ onClose, onFinished, onLetterFixed }) {
  const [phase, setPhase] = useState("adding");
  const [addedItems, setAddedItems] = useState([]);

  const repairItems = [
    {
      id: "piece1",
      name: "Piece 1",
      image: "broken_file_1.png",
      flyClass: "translate-x-[150px] translate-y-[170px] rotate-[180deg]",
    },
    {
      id: "piece2",
      name: "Piece 2",
      image: "broken_file_2.png",
      flyClass: "translate-x-[75px] translate-y-[170px] rotate-[-160deg]",
    },
    {
      id: "piece3",
      name: "Piece 3",
      image: "broken_file_3.png",
      flyClass: "translate-x-0 translate-y-[170px] rotate-[220deg]",
    },
    {
      id: "piece4",
      name: "Piece 4",
      image: "broken_file_4.png",
      flyClass: "-translate-x-[75px] translate-y-[170px] rotate-[-220deg]",
    },
    {
      id: "mixingAgent",
      name: "Glue",
      image: "glue_bottle.png",
      flyClass: "-translate-x-[150px] translate-y-[170px] rotate-[140deg]",
    },
  ];

  function addItem(itemId) {
    if (phase !== "adding") return;

    setAddedItems((currentItems) => {
      if (currentItems.includes(itemId)) {
        return currentItems;
      }

      const newItems = [...currentItems, itemId];

      if (newItems.length === repairItems.length) {
        setTimeout(() => {
          setPhase("stirring");
        }, 1000);

        setTimeout(() => {
  setPhase("fixed");
  onLetterFixed();
}, 7000);
      }

      return newItems;
    });
  }

  function downloadLetter() {
    const link = document.createElement("a");
    link.href = `${import.meta.env.BASE_URL}letter.png`;
    link.download = "letter.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onFinished();
  }

  return (
    <div className="absolute left-1/2 top-20 z-[100] w-[520px] -translate-x-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[5px_5px_0_#000]">
      <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}cauldron.png`}
            alt=""
            className="h-5 w-5 object-contain"
            draggable="false"
          />
          <span>Cauldron</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
        >
          ×
        </button>
      </div>

      <div className="relative min-h-[430px] bg-[#d4d0c8] px-5 py-5">
        {phase === "adding" && (
          <>
            <div className="mb-6 flex justify-center gap-4">
              {repairItems.map((item) => {
                const isAdded = addedItems.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item.id)}
                    disabled={isAdded}
                    className={`relative z-20 flex h-16 w-16 items-center justify-center rounded bg-white/60 p-1 transition-all duration-1000 ease-in ${
                      isAdded
                        ? `${item.flyClass} opacity-0`
                        : "translate-x-0 translate-y-0 opacity-100 hover:bg-white"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${item.image}`}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      draggable="false"
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}cauldron.png`}
                alt="Cauldron"
                className="h-48 w-48 object-contain"
                draggable="false"
              />
            </div>

            <p className="mt-8 text-center text-lg">
              click on each item to add it into the cauldron!
            </p>
          </>
        )}

        {phase === "stirring" && (
          <div className="flex h-[390px] flex-col items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}cauldron_stirring.gif`}
              alt="Cauldron stirring"
              className="h-64 w-64 object-contain"
              draggable="false"
            />

            <p className="mt-5 text-lg">mixing...</p>
          </div>
        )}

        {phase === "fixed" && (
          <div className="flex h-[390px] flex-col items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}txt_file_icon.png`}
              alt="Fixed letter"
              className="max-h-[260px] max-w-[360px] object-contain"
              draggable="false"
            />

            <p className="mt-5 text-xl font-bold">letter fixed!</p>

            <button
              type="button"
              onClick={() => setPhase("download")}
              className="mt-4 min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
            >
              yay!
            </button>
          </div>
        )}

        {phase === "download" && (
          <div className="flex h-[390px] flex-col items-center justify-center text-center">
            <img
              src={`${import.meta.env.BASE_URL}txt_file_icon.png`}
              alt="Fixed letter"
              className="mb-5 max-h-[220px] max-w-[320px] object-contain"
              draggable="false"
            />

            <p className="text-lg">would you like to download letter.png?</p>

            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={downloadLetter}
                className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={onFinished}
                className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LetterChaosOverlay({ onClose }) {
  const [stage, setStage] = useState("confirm");
  const [visibleErrorCount, setVisibleErrorCount] = useState(0);
  const [closedErrors, setClosedErrors] = useState([]);
  const [filePhase, setFilePhase] = useState("normal");
  const [flyPieces, setFlyPieces] = useState(false);
  const [showBrokenText, setShowBrokenText] = useState(false);
  const crackSoundPlayed = useRef(false);
const brokeSoundPlayed = useRef(false);

  const errorMessages = [
    "ERROR: Letter failed to open.",
    "ERROR: File unstable just like ur mental state.",
    "ERROR: The letter just hates you ok.",
    "ERROR: Letter integrity damaged.",
    "ERROR: why would you do that",
    "ERROR: Woofdows cannot recover file.",
  ];

  function playSound(fileName, volume = 0.6) {
    const audio = new Audio(`${import.meta.env.BASE_URL}${fileName}`);
    audio.volume = volume;

    audio.play().catch(() => {
      console.log(`${fileName} could not play.`);
    });
  }

  function handleNo() {
    onClose();
  }

  function handleYes() {
    setStage("opening");

    setTimeout(() => {
      setStage("errors");
    }, 2600);

    for (let i = 1; i <= errorMessages.length; i += 1) {
      setTimeout(() => {
        setVisibleErrorCount(i);
        playSound("error_sound.mp3", 0.55);
      }, 2600 + i * 550);
    }
  }

  function startBrokenLetterSequence() {
  setStage("trying");
  setShowBrokenText(false);

 setTimeout(() => {
  setStage("ohno");
  setFilePhase("cracked");

  if (!crackSoundPlayed.current) {
    crackSoundPlayed.current = true;
    playSound("crack_sound.mp3", 0.7);
  }
}, 4200);

setTimeout(() => {
  setFilePhase("pieces");
  setFlyPieces(false);

  if (!brokeSoundPlayed.current) {
    brokeSoundPlayed.current = true;
    playSound("broke_sound.mp3", 0.75);
  }

  setTimeout(() => {
    setFlyPieces(true);
  }, 150);
}, 5700);

  setTimeout(() => {
    setFilePhase("gone");
  }, 7600);

  setTimeout(() => {
    setShowBrokenText(true);
  }, 8400);
}

  function closeError(errorIndex) {
    setClosedErrors((currentClosedErrors) => {
      if (currentClosedErrors.includes(errorIndex)) {
        return currentClosedErrors;
      }

      const newClosedErrors = [...currentClosedErrors, errorIndex];

      if (newClosedErrors.length >= errorMessages.length) {
        startBrokenLetterSequence();
      }

      return newClosedErrors;
    });
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[100]">
      {(stage === "confirm" || stage === "opening") && (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 h-[240px] w-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]">
          <div className="bg-[#000080] px-2 py-1 text-sm font-bold text-white">
            Woofdows
          </div>

          <div className="flex flex-col items-center px-3 pt-2 pb-1 text-center">
            <img
              src={`${import.meta.env.BASE_URL}txt_file_icon.png`}
              alt="Letter file"
              className="-mb-3 h-[104px] w-[104px] object-contain"
              draggable="false"
            />

            <p className="whitespace-nowrap pt-7 text-xl leading-none">
              {stage === "confirm" ? "Open letter?" : "Opening..."}
            </p>
          </div>

          {stage === "confirm" && (
            <div className="flex justify-center gap-1 px-1 pb-2">
              <button
                type="button"
                onClick={handleYes}
                className="min-w-16 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-3 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={handleNo}
                className="min-w-16 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-3 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
              >
                No
              </button>
            </div>
          )}
        </div>
      )}

      {stage === "errors" && (
        <>
          {errorMessages
            .slice(0, visibleErrorCount)
            .map((errorText, index) => ({ errorText, index }))
            .filter((error) => !closedErrors.includes(error.index))
            .map((error) => (
              <div
                key={error.index}
                className="pointer-events-auto absolute w-[360px] border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[4px_4px_0_#000]"
                style={{
  left: `${window.innerWidth / 2 - 260 + error.index * 36}px`,
  top: `${window.innerHeight / 2 - 190 + error.index * 34}px`,
  zIndex: 120 + error.index,
}}
              >
                <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
                  <span>Woofdows Error</span>
                  <button
                    type="button"
                    onClick={() => closeError(error.index)}
                    className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center gap-4 px-4 py-5">
                  <img
                    src={`${import.meta.env.BASE_URL}error_icon.png`}
                    alt="Error"
                    className="h-10 w-10 object-contain"
                    draggable="false"
                  />

                  <p className="text-sm">{error.errorText}</p>
                </div>

                <div className="flex justify-end px-3 pb-3">
                  <button
                    type="button"
                    onClick={() => closeError(error.index)}
                    className="min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
                  >
                    OK
                  </button>
                </div>
              </div>
            ))}
        </>
      )}

      {(stage === "trying" || stage === "ohno") && (
        <div
  className={`pointer-events-auto absolute left-1/2 top-1/2 ${
    showBrokenText ? "h-[150px] w-[390px]" : "h-[300px] w-[320px]"
  } -translate-x-1/2 -translate-y-1/2 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] p-1 text-black shadow-[5px_5px_0_#000] transition-all duration-500`}
>
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-sm font-bold text-white">
            <span>Woofdows Message</span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-5 w-5 items-center justify-center border border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] text-xs font-bold text-black"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col items-center px-6 pt-5">
            <p className="mb-2 h-6 text-lg font-bold leading-none">
              {stage === "trying"
  ? "trying to open again..."
  : showBrokenText
    ? "you broke the letter..."
    : "oh no...."}
            </p>
            {showBrokenText && (
  <button
    type="button"
    onClick={onClose}
    className="mt-3 min-w-20 border-2 border-[#808080] border-l-[#ffffff] border-t-[#ffffff] bg-[#c0c0c0] px-4 py-1 text-sm text-black shadow-[1px_1px_0_#000]"
  >
    what
  </button>
)}

                        {!showBrokenText && (
              <div className="relative h-[210px] w-[100px]">
                {filePhase === "normal" && (
                  <img
                    src={`${import.meta.env.BASE_URL}txt_file_icon.png`}
                    alt="Letter file"
                    className="absolute left-1/2 top-[42%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 object-contain"
                    draggable="false"
                  />
                )}

                {filePhase === "cracked" && (
                  <img
                    src={`${import.meta.env.BASE_URL}broken_letter.png`}
                    alt="Broken letter"
                    className="absolute left-1/2 top-[42%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 object-contain ease-in"
                    draggable="false"
                  />
                )}

                {(filePhase === "pieces" || filePhase === "gone") && (
                  <div className="absolute left-1/2 top-[42%] h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2">
                    {filePhase === "pieces" && (
                      <>
                        <img
                          src={`${import.meta.env.BASE_URL}broken_file_1.png`}
                          alt="Broken letter piece 1"
                          className="absolute left-0 top-0 h-20 w-20 object-contain transition-all duration-[1600ms] ease-in"
                          style={{
                            transform: flyPieces
                              ? "translate(-420px, -310px) rotate(-720deg)"
                              : "translate(0, 0) rotate(0deg)",
                            opacity: flyPieces ? 0 : 1,
                          }}
                          draggable="false"
                        />

                        <img
                          src={`${import.meta.env.BASE_URL}broken_file_2.png`}
                          alt="Broken letter piece 2"
                          className="absolute right-0 top-0 h-20 w-20 object-contain transition-all duration-[1600ms] ease-in"
                          style={{
                            transform: flyPieces
                              ? "translate(420px, -310px) rotate(720deg)"
                              : "translate(0, 0) rotate(0deg)",
                            opacity: flyPieces ? 0 : 1,
                          }}
                          draggable="false"
                        />

                        <img
                          src={`${import.meta.env.BASE_URL}broken_file_3.png`}
                          alt="Broken letter piece 3"
                          className="absolute bottom-0 left-0 h-20 w-20 object-contain transition-all duration-[1600ms] ease-in"
                          style={{
                            transform: flyPieces
                              ? "translate(-420px, 310px) rotate(720deg)"
                              : "translate(0, 0) rotate(0deg)",
                            opacity: flyPieces ? 0 : 1,
                          }}
                          draggable="false"
                        />

                        <img
                          src={`${import.meta.env.BASE_URL}broken_file_4.png`}
                          alt="Broken letter piece 4"
                          className="absolute bottom-0 right-0 h-20 w-20 object-contain transition-all duration-[1600ms] ease-in"
                          style={{
                            transform: flyPieces
                              ? "translate(420px, 310px) rotate(-720deg)"
                              : "translate(0, 0) rotate(0deg)",
                            opacity: flyPieces ? 0 : 1,
                          }}
                          draggable="false"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;