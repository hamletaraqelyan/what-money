$(() => {
  $(window).on("beforeunload", function () {
    $(window).scrollTop(0);
  });

  function addCommas(number) {
    // Handle non-numeric input gracefully
    if (isNaN(number)) {
      return "Invalid input: Enter a valid number.";
    }

    // Convert to string for formatting
    let numString = number.toString();

    // Split positive and negative signs (if present)
    let sign = "";
    if (numString.startsWith("-")) {
      sign = "-";
      numString = numString.slice(1); // Remove the sign from the string
    }

    // Split integer and decimal parts, handle decimals gracefully
    let decimalIndex = numString.indexOf(".");
    let integerPart,
      decimalPart = "";
    if (decimalIndex >= 0) {
      integerPart = numString.slice(0, decimalIndex);
      decimalPart = numString.slice(decimalIndex);
    } else {
      integerPart = numString;
    }

    // Reverse the integer part, insert commas every 3 digits
    let reversedIntegerPart = integerPart.split("").reverse().join("");
    let formattedIntegerPart = "";
    for (let i = 0; i < reversedIntegerPart.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formattedIntegerPart += ",";
      }
      formattedIntegerPart += reversedIntegerPart[i];
    }

    // Reverse the formatted integer part to get the correct order
    formattedIntegerPart = formattedIntegerPart.split("").reverse().join("");

    // Combine sign, formatted integer part, and decimal part (if applicable)
    return sign + formattedIntegerPart + decimalPart;
  }

  //   Currency rate
  const getExchangeRate = (from, to, rate, type) => {
    if (type === "to") {
      return 1 / rate[`${to}_${from}`];
    }
    return rate[`${from}_${to}`];
  };

  let PUBLIC_URL = "./";
  const url = window.location.href;
  if (url.indexOf("ru") !== -1) {
    PUBLIC_URL = "../";
  }

  const currencyList = {
    selectedFrom: "rub",
    selectedTo: "usdt",
    list: {
      usd: {
        img: `${PUBLIC_URL}public/media/icons/currency/usd.svg`,
        name: "usd",
        title: "USD",
        longTitle: "US Dollar",
        notExchange: ["usd"],
        to: {
          rub: (value, type, rate) =>
            value * getExchangeRate("usdt", "rub", rate, type),
          usdt: (value, type) => {
            let decreasePercentage;

            if (value < 5000) {
              decreasePercentage = 0.05; // 5%
            } else {
              decreasePercentage = 0.03; // 3%
            }

            if (type === "to") {
              return value / (1 - decreasePercentage);
            }
            return value - value * decreasePercentage;
          },
          uah: (value, type, rate) =>
            value * getExchangeRate("usdt", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("usdt", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("usdt", "byn", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("usdt", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("usdt", "eth", rate, type),
        },
      },
      rub: {
        img: `${PUBLIC_URL}public/media/icons/currency/rub.svg`,
        name: "rub",
        title: "RUB",
        longTitle: "Russian Ruble",
        notExchange: ["rub"],
        to: {
          usd: (value, type, rate) =>
            value * getExchangeRate("rub", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("rub", "usdt", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("rub", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("rub", "eth", rate, type),
          uah: (value, type, rate) =>
            value * getExchangeRate("rub", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("rub", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("rub", "byn", rate, type),
        },
      },
      usdt: {
        img: `${PUBLIC_URL}public/media/icons/currency/usdt.svg`,
        name: "usdt",
        title: "USDT",
        longTitle: "Tether",
        notExchange: ["usdt"],
        to: {
          rub: (value, type, rate) =>
            value * getExchangeRate("usdt", "rub", rate, type),
          usd: (value, type) => {
            let decreasePercentage;

            if (value < 5000) {
              decreasePercentage = 0.05; // 5%
            } else {
              decreasePercentage = 0.03; // 3%
            }

            if (type === "to") {
              return value / (1 - decreasePercentage);
            }
            return value - value * decreasePercentage;
          },
          uah: (value, type, rate) =>
            value * getExchangeRate("usdt", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("usdt", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("usdt", "byn", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("usdt", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("usdt", "eth", rate, type),
        },
      },
      btc: {
        img: `${PUBLIC_URL}public/media/icons/currency/btc.svg`,
        name: "btc",
        title: "BTC",
        longTitle: "Bitcoin",
        notExchange: ["btc"],
        to: {
          rub: (value, type, rate) =>
            value * getExchangeRate("btc", "rub", rate, type),
          uah: (value, type, rate) =>
            value * getExchangeRate("btc", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("btc", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("btc", "byn", rate, type),
          usd: (value, type, rate) =>
            value * getExchangeRate("btc", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("btc", "usdt", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("btc", "eth", rate, type),
        },
      },
      eth: {
        img: `${PUBLIC_URL}public/media/icons/currency/eth.svg`,
        name: "eth",
        title: "ETH",
        longTitle: "Ethereum",
        notExchange: ["eth"],
        to: {
          rub: (value, type, rate) =>
            value * getExchangeRate("eth", "rub", rate, type),
          uah: (value, type, rate) =>
            value * getExchangeRate("eth", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("eth", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("eth", "byn", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("eth", "btc", rate, type),
          usd: (value, type, rate) =>
            value * getExchangeRate("eth", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("eth", "usdt", rate, type),
        },
      },
      uah: {
        img: `${PUBLIC_URL}public/media/icons/currency/uah.svg`,
        name: "uah",
        title: "UAH",
        longTitle: "Ukrainian Hryvnia",
        notExchange: ["uah"],
        to: {
          usd: (value, type, rate) =>
            value * getExchangeRate("uah", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("uah", "usdt", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("uah", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("uah", "eth", rate, type),
          rub: (value, type, rate) =>
            value * getExchangeRate("uah", "rub", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("uah", "kzt", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("uah", "byn", rate, type),
        },
      },
      kzt: {
        img: `${PUBLIC_URL}public/media/icons/currency/kzt.svg`,
        name: "kzt",
        title: "KZT",
        longTitle: "Kazakhstani Tenge",
        notExchange: ["kzt"],
        to: {
          usd: (value, type, rate) =>
            value * getExchangeRate("kzt", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("kzt", "usdt", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("kzt", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("kzt", "eth", rate, type),
          rub: (value, type, rate) =>
            value * getExchangeRate("kzt", "rub", rate, type),
          uah: (value, type, rate) =>
            value * getExchangeRate("kzt", "uah", rate, type),
          byn: (value, type, rate) =>
            value * getExchangeRate("kzt", "byn", rate, type),
        },
      },
      byn: {
        img: `${PUBLIC_URL}public/media/icons/currency/byn.svg`,
        name: "byn",
        title: "BYN",
        longTitle: "Belarusian Ruble",
        notExchange: ["byn"],
        to: {
          usd: (value, type, rate) =>
            value * getExchangeRate("byn", "usdt", rate, type),
          usdt: (value, type, rate) =>
            value * getExchangeRate("byn", "usdt", rate, type),
          btc: (value, type, rate) =>
            value * getExchangeRate("byn", "btc", rate, type),
          eth: (value, type, rate) =>
            value * getExchangeRate("byn", "eth", rate, type),
          rub: (value, type, rate) =>
            value * getExchangeRate("byn", "rub", rate, type),
          uah: (value, type, rate) =>
            value * getExchangeRate("byn", "uah", rate, type),
          kzt: (value, type, rate) =>
            value * getExchangeRate("byn", "kzt", rate, type),
        },
      },
    },
  };

  const generateDropdownItem = (currencyItem, type, active) => {
    return `<div
              data-name="${currencyItem.name}"
              data-type="${type}"
              data-image="${currencyItem.img}"
              class="currency-item ${active ? "active" : ""}"
            >
              <img
                class="currency-image"
                src="${currencyItem.img}"
                alt="${currencyItem.longTitle}"
              />
              <p class="currency-name">${currencyItem.title}</p>
              <span class="currency-name-long">${currencyItem.longTitle}</span>
            </div>`;
  };

  const generateCurrencyWrapperItem = (currencyItem) => {
    return `<img
              class="currency-image"
              src="${currencyItem.img}"
              alt="${currencyItem.longTitle}"
            />
            <p class="currency-name">${currencyItem.title}</p>
            <img
              class="chevron"
              src="${PUBLIC_URL}public/media/icons/chevron-down.svg"
              alt="chevron down"
            />`;
  };

  const setDropdownListHTML = () => {
    let leftDropdownListHTML = "";
    let rightDropdownListHTML = "";
    const fromItem = currencyList.list[currencyList.selectedFrom];
    const toItem = currencyList.list[currencyList.selectedTo];
    const fromNotExange = fromItem.notExchange;
    const toNotExange = toItem.notExchange;

    for (const currencyKey in currencyList.list) {
      if (Object.hasOwnProperty.call(currencyList.list, currencyKey)) {
        const currencyItem = currencyList.list[currencyKey];

        leftDropdownListHTML += !toNotExange.includes(currencyItem.name)
          ? generateDropdownItem(
              currencyItem,
              "from",
              currencyList.selectedFrom === currencyItem.name
            )
          : "";

        rightDropdownListHTML += !fromNotExange.includes(currencyItem.name)
          ? generateDropdownItem(
              currencyItem,
              "to",
              currencyList.selectedTo === currencyItem.name
            )
          : "";
      }
    }

    $("#exchangeWrapperFirst .currency-wrapper").html(
      generateCurrencyWrapperItem(fromItem)
    );
    $("#exchangeWrapperSecond .currency-wrapper").html(
      generateCurrencyWrapperItem(toItem)
    );

    $("#exchangeWrapperFirst .currency-switch").html(leftDropdownListHTML);
    $("#exchangeWrapperSecond .currency-switch").html(rightDropdownListHTML);
  };

  const setInputHtml = (leftInputValue = 1000, rightInputValue = "") => {
    let leftInputHTML = $("#inputWrapperFirst input");
    let rightInputHTML = $("#inputWrapperSecond input");

    const leftInputName = currencyList.list[currencyList.selectedFrom].name;
    const rightInputName = currencyList.list[currencyList.selectedTo].name;

    leftInputHTML.attr("name", leftInputName);
    leftInputHTML.val(leftInputValue);

    rightInputHTML.attr("name", rightInputName);
    rightInputHTML.val(rightInputValue);
  };

  const setFirstInputValue = (value) => {
    $("#inputWrapperFirst input").val(value);
  };

  const setSecondInputValue = (value) => {
    $("#inputWrapperSecond input").val(value);
  };

  setInputHtml();
  setDropdownListHTML();

  const doExchange = (value, type = "from", rates) => {
    if (value === 0) {
      return "";
    }

    const from = currencyList.selectedFrom;
    const to = currencyList.selectedTo;

    const decimalDigitsFrom = to === "btc" || to === "eth" ? 8 : 2;
    const decimalDigitsTo = from === "btc" || to === "eth" ? 8 : 2;

    return type === "from"
      ? roundToTwoDecimals(
          currencyList.list[from].to[to](value, type, rates),
          decimalDigitsFrom
        )
      : roundToTwoDecimals(
          currencyList.list[to].to[from](value, type, rates),
          decimalDigitsTo
        );
  };

  function roundToTwoDecimals(inputNumber, digitsNumber = 2) {
    return inputNumber.toFixed(digitsNumber);
  }

  $(".currency-wrapper").on("click", (e) => {
    e.stopPropagation();
    $(e.currentTarget).parent().find(".currency-switch").addClass("show");
  });

  const getTodayInFormat = () => {
    const currentDate = new Date();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    return `${month} ${date}, ${year}, ${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } UTC`;
  };

  $("#todayDateInUTC").text(getTodayInFormat());

  fetch("https://whatmoneyapi.azurewebsites.net/currencies")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((fetchRates) => {
      setSecondInputValue(doExchange(1000, "from", fetchRates));
      $("#moneyTo").text(
        addCommas(
          roundToTwoDecimals(
            currencyList.list.rub.to.usdt(100000, "from", fetchRates)
          )
        )
      );
      $("#oneRubToUsd #usdValue").text(
        addCommas(
          roundToTwoDecimals(
            currencyList.list.rub.to.usdt(1, "from", fetchRates)
          )
        )
      );

      const firstInput = $("#inputWrapperFirst input");
      const secondInput = $("#inputWrapperSecond input");

      firstInput.on("input", function () {
        const val = +$(this).val();
        setSecondInputValue(doExchange(val, "from", fetchRates));
      });

      secondInput.on("input", function () {
        const val = +$(this).val();
        setFirstInputValue(doExchange(val, "to", fetchRates));
      });

      firstInput.on("blur", function () {
        if (+$(this).val() === 0 || $(this).val() === "") {
          setInputHtml();
          setSecondInputValue(doExchange(1000, "from", fetchRates));
        }
      });

      secondInput.on("blur", function () {
        if (+$(this).val() === 0 || $(this).val() === "") {
          setInputHtml();
          setSecondInputValue(doExchange(1000, "from", fetchRates));
        }
      });

      $("#switch-currencies").on("click", () => {
        const temp = currencyList.selectedFrom;
        currencyList.selectedFrom = currencyList.selectedTo;
        currencyList.selectedTo = temp;

        const secondInput = $("#inputWrapperSecond input");
        const secondInpValue = +secondInput.val();

        setDropdownListHTML();
        setInputHtml(
          secondInpValue,
          doExchange(secondInpValue, "from", fetchRates)
        );
      });

      $(document).on("click", ".currency-switch .currency-item", function () {
        const parent = $(this).parent();
        const itemType = $(this).data("type");
        const itemName = $(this).data("name");

        if (itemType === "from") {
          currencyList.selectedFrom = itemName;
        } else {
          currencyList.selectedTo = itemName;
        }

        setDropdownListHTML();
        setInputHtml(1000, doExchange(1000, "from", fetchRates));
        parent.removeClass("show");
      });

      function handleOutsideClick(event) {
        const container = $(".currency-switch");

        if (
          !container.is(event.target) &&
          container.has(event.target).length === 0
        ) {
          container.removeClass("show");
        }
      }

      $(document).on("mousedown", handleOutsideClick);

      //rocket slider
      $(".canvas-range #slider").on("input", (e) => {
        const value = $(e.target).val();
        $(".canvas-rangeBtn").css("left", `${value / 100000}%`);
        const transformValue = `scaleX(${value / 10000000}) translateY(-50%)`;
        $(".canvas-range .dark .dark-overlay").css("transform", transformValue);

        $("#moneyFrom").text(addCommas(value));
        $("#moneyTo").text(
          addCommas(
            roundToTwoDecimals(
              currencyList.list.rub.to.usdt(value, "from", fetchRates)
            )
          )
        );
      });

      firstInput.removeAttr("placeholder");
      secondInput.removeAttr("placeholder");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  $.ajax({
    url: "https://whatmoneyapi.azurewebsites.net/rates", // Sample API endpoint
    type: "GET",
    success: function (fetchData) {
      //Chart
      const ctx = document.getElementById("myChart").getContext("2d");

      const data = [...fetchData];

      const totalDuration = 1500;
      const delayBetweenPoints = totalDuration / data.length;
      const previousY = (ctx) =>
        ctx.index === 0
          ? ctx.chart.scales.y.getPixelForValue(100)
          : ctx.chart
              .getDatasetMeta(ctx.datasetIndex)
              .data[ctx.index - 1].getProps(["y"], true).y;
      const animation = {
        x: {
          type: "number",
          duration: delayBetweenPoints,
          from: NaN, // the point is initially skipped
          delay(ctx) {
            if (ctx.type !== "data" || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
        y: {
          type: "number",
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
      };

      const gradient = ctx.createLinearGradient(0, -2000, 0, 300);
      gradient.addColorStop(0, "rgba(24, 131, 255, 1)");
      gradient.addColorStop(1, "rgba(24, 131, 255, 0)");

      // Config block
      const config = {
        type: "line",
        data: {
          datasets: [
            {
              fill: true,
              backgroundColor: gradient,
              borderWidth: 3,
              borderColor: "#1883FF",
              tension: 0.5,
              radius: 0,
              pointRadius: 0,
              data: data,
            },
          ],
        },
        options: {
          animation,
          interaction: {
            intersect: false,
          },
          plugins: {
            legend: false,
          },
          scales: {
            x: {
              type: "time",
              time: { unit: "day" },
              grid: {
                display: false, // Remove grid lines on the x-axis
                drawBorder: false, // Remove left border
              },
              ticks: {
                // autoSkip: true,
                // maxRotation: 90,
                // minRotation: 90,
                // maxTicksLimit: 6,
                // minTicksLimit: 20,
                color: "#090909",
                font: {
                  size: 12,
                },
              },
            },
            y: {
              ticks: {
                color: "#9D9D9D",
                font: {
                  size: 14,
                },
              },
              grid: {
                display: false, // Remove grid lines on the y-axis
                drawBorder: false, // Remove left border
              },
            },
          },
        },
      };

      new Chart(ctx, config);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      // Handle error
    },
  });

  //Chart

  //Gsap | Digital revolution
  gsap.registerPlugin(ScrollTrigger);

  // Pin first section with ID "pinned-section-1"
  ScrollTrigger.create({
    trigger: "#pinned-section-1",
    start: "bottom bottom",
    end: `+=${document.querySelector("#pinned-section-1").offsetHeight}`,
    pin: true,
  });

  //Gsap | Cards animation
  ScrollTrigger.create({
    trigger: ".animated-cards .cards-wrapper",
    start: "center bottom",
    end: "center bottom",
    toggleClass: {
      targets: ".animated-cards .cards-wrapper",
      className: "slide-cards",
    },
    once: true,
  });

  // Pin section with ID "pinned-section-2"
  ScrollTrigger.create({
    trigger: "#pinned-section-2",
    start: "bottom+=3% bottom",
    end: `+=${1.5 * document.querySelector("#pinned-section-2").offsetHeight}`,
    pin: true,
    toggleClass: {
      targets: ".human",
      className: "show-text-block",
      immediateRender: true,
    },
  });

  gsap.to(".robo", {
    x: "-100%",
    duration: 2,
    scrollTrigger: {
      trigger: ".robo",
      start: `bottom center+=200`,
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 1,
      //onEnter  onLeave  onEnterBack  onLeaveBack
    },
  });

  gsap.to(".human", {
    x: "100%",
    duration: 2,
    scrollTrigger: {
      trigger: ".human",
      start: "bottom center+=200",
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 1,
    },
  });

  gsap.to(".spiral", {
    scale: "1",
    duration: 2,
    scrollTrigger: {
      trigger: ".spiral",
      start: "bottom bottom",
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 1,
    },
  });

  gsap.to(".text-box-robo", {
    opacity: "0",
    x: "-50%",
    duration: 1,
    scrollTrigger: {
      trigger: ".robo",
      start: "bottom center+=200",
      end: "bottom center-=100",
      toggleActions: "restart pause resume complete",
      scrub: 1,
      // markers: true,
    },
  });

  gsap.to(".text-box-spiral", {
    opacity: "1",
    scale: "1",
    duration: 1,
    scrollTrigger: {
      trigger: ".gsap-container",
      start: "bottom bottom",
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 1,
    },
  });

  gsap.to(".floating-card.first", {
    y: "-500%",
    x: "50%",
    rotate: "-10deg",
    duration: 3,
    scrollTrigger: {
      trigger: "#pinned-section-1",
      start: `center bottom`,
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 5,
    },
  });

  gsap.to(".floating-card.second", {
    y: "-550%",
    x: "-50%",
    rotate: "20deg",
    scale: "1.5",
    duration: 3,
    scrollTrigger: {
      trigger: "#pinned-section-1",
      start: `center+=200 bottom`,
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 5,
    },
  });

  gsap.to(".floating-card.third", {
    y: "-600%",
    x: "20%",
    rotate: "-20deg",
    duration: 6,
    scrollTrigger: {
      trigger: "#pinned-section-1",
      start: `bottom-=100 bottom`,
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 5,
    },
  });

  // Pin section with ID "pinned-section-3"
  ScrollTrigger.create({
    trigger: "#pinned-section-3",
    start: "bottom bottom",
    end: `+=${1.5 * document.querySelector("#pinned-section-3").offsetHeight}`,
    pin: true,
  });

  gsap.to("#pinned-section-3 .scalable-element", {
    scale: "1",
    x: 0,
    y: 0,
    borderRadius: "24px",
    duration: 2,
    scrollTrigger: {
      trigger: "#pinned-section-3",
      start: "bottom bottom",
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 1,
      //onEnter  onLeave  onEnterBack  onLeaveBack
    },
  });

  gsap.to("#pinned-section-3 .scalable-element .text-box", {
    scale: "1",
    opacity: "1",
    y: "0",
    duration: 5,
    scrollTrigger: {
      trigger: "#pinned-section-3",
      start: "bottom bottom",
      end: "bottom top",
      toggleActions: "restart pause resume complete",
      scrub: 3,
      //onEnter  onLeave  onEnterBack  onLeaveBack
    },
  });

  //Tabs block
  function openTab() {
    const currentTab = $(this).data("tab");

    $(".tabcontent").removeClass("show");
    $(".tablinks").removeClass("active");
    $("#" + currentTab).addClass("show");
    $(this).addClass("active");
  }

  $("#tab1").addClass("show");
  $(".tablinks").eq(0).addClass("active");

  $(".tablinks").on("click", openTab);
});
