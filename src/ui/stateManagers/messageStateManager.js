export const messageUI = {
  updateMessageUI(suffix, moveResult) {
    const message = document.querySelector(`.message-${suffix}`);

    const messages = {
      invalid: [
        "Arrr! That's not a valid move, Captain!",
        "You can't fire there, Commander! Check your coordinates!",
        "Those coordinates are impossible! Recalibrate and try again!",
      ],

      miss: [
        "The enemy lives to sail another day...",
        "We'll get them next time! For now, we must be patient.",
        "The ocean graciously accepts your donation!",
      ],

      hit: [
        "BOOM! That's gonna leave a mark!",
        "Enemy ship damaged! They're taking on water!",
        "Target struck! Keep up the pressure!",
      ],

      sunk: [
        "Another ship sleeps with the fishes!",
        "SHIP DESTROYED! The sea claims another victim!",
        "The enemy crew is abandoning ship!",
      ],

      win: [
        "TOTAL VICTORY! The seas belong to you now, Admiral!",
        "Enemy fleet decimated! You're the undisputed ruler of these waters!",
        "Not a single enemy ship left floating! Legendary victory!",
      ],
    };

    const possibleMessages = messages[moveResult.type] || [
      "Standing by for orders, Captain!",
    ];
    const randomIndex = Math.floor(Math.random() * possibleMessages.length);

    const emoji = {
      invalid: "⛔",
      miss: "🌊",
      hit: "💥",
      sunk: "🏴‍☠️",
      win: "🏆",
    };

    message.textContent = `${emoji[moveResult.type] || ""} ${
      possibleMessages[randomIndex]
    }`;
    message.className = `message-${suffix} message-animate-${moveResult.type}`;

    if (moveResult.type === "win") {
      this.clearMessageBoard(suffix === "one" ? "two" : "one");
    }

    if (moveResult.type !== "win") {
      setTimeout(() => {
        message.classList.remove(`message-animate-${moveResult.type}`);
      }, 1000);
    }
  },

  clearMessageBoard(suffix) {
    const message = document.querySelector(`.message-${suffix}`);
    message.textContent = "";
  },
};
