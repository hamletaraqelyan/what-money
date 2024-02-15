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
  const usdToRub = (usd, rate, exchangeType) => {
    let decidedRate =
      exchangeType === "receive" ? rate.rubToUsd : rate.usdToRub;
    return usd * decidedRate;
  };

  const rubToUsd = (rub, rate, exchangeType) => {
    let decidedRate =
      exchangeType === "receive" ? rate.usdToRub : rate.rubToUsd;
    return rub / decidedRate;
  };

  const usdToUsdt = (number, exchangeType) => {
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    let decreasePercentage;

    if (number < 5000) {
      decreasePercentage = 0.05; // 5%
    } else {
      decreasePercentage = 0.03; // 3%
    }

    if (exchangeType === "receive") {
      return number / (1 - decreasePercentage);
    }
    return number - number * decreasePercentage;
  };

  const usdtToUsd = (number, exchangeType) => {
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    let decreasePercentage;

    if (number < 5000) {
      decreasePercentage = 0.05; // 5%
    } else {
      decreasePercentage = 0.03; // 3%
    }

    if (exchangeType === "receive") {
      return number / (1 - decreasePercentage);
    }
    return number - number * decreasePercentage;
  };

  const rubToUsdt = (rub, rate, exchangeType) => {
    const usd = rubToUsd(rub, rate, exchangeType);
    return usd;
    // return usdToUsdt(usd, exchangeType);
  };

  const usdtToRub = (usdt, rate, exchangeType) => {
    // const USD = usdtToUsd(usdt, exchangeType);
    return usdToRub(usdt, rate, exchangeType);
    // return usdToRub(USD, rate, exchangeType);
  };

  function roundToTwoDecimals(inputNumber) {
    if (inputNumber === 0) {
      return 0;
    }
    // Round the input number to two decimal places
    const roundedNumber = inputNumber.toFixed(2);

    return roundedNumber;
  }

  const exchange = (from, to, value, rate, exchangeType) => {
    if (from === to) {
      return value;
    }

    if (value === 0) {
      return "";
    } else {
      if (from === "rub") {
        if (to === "usd") {
          return roundToTwoDecimals(rubToUsd(value, rate, exchangeType));
        } else if (to === "usdt") {
          return roundToTwoDecimals(rubToUsdt(value, rate, exchangeType));
        }
      } else if (from === "usd") {
        if (to === "rub") {
          return roundToTwoDecimals(usdToRub(value, rate, exchangeType));
        } else if (to === "usdt") {
          return roundToTwoDecimals(usdToUsdt(value, exchangeType));
        }
      } else if (from === "usdt") {
        if (to === "rub") {
          return roundToTwoDecimals(usdtToRub(value, rate, exchangeType));
        } else if (to === "usd") {
          return roundToTwoDecimals(usdtToUsd(value, exchangeType));
        }
      }
    }
  };

  const updateInput = (input, newValue, newName) => {
    $(input).attr("name", newName);
    $(input).val(newValue);
  };

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

  //Chart

  fetch("https://whatmoneyapi.azurewebsites.net/rb")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      $("#inputWrapperSecond input").val(
        roundToTwoDecimals(rubToUsdt(1000, data, "send"))
      );

      $("#moneyTo").text(addCommas(exchange("rub", "usdt", 100000, data)));

      $("#inputWrapperFirst input").on("input", function () {
        const val = +$(this).val();
        const name = $(this).attr("name");

        const secondInput = $("#inputWrapperSecond input");
        const secondName = secondInput.attr("name");

        secondInput.val(exchange(name, secondName, val, data, "send"));
      });

      $("#inputWrapperSecond input").on("input", function () {
        const val = +$(this).val();
        const name = $(this).attr("name");

        const firstInput = $("#inputWrapperFirst input");
        const firstInputName = firstInput.attr("name");

        firstInput.val(exchange(name, firstInputName, val, data, "receive"));
      });

      $("#switch-currencies").on("click", () => {
        const firstWrapper = $("#exchangeWrapperFirst .currency-wrapper");
        const firstWrapperDropdown = $(
          "#exchangeWrapperFirst .currency-switch"
        );
        const firstInput = $("#inputWrapperFirst input");
        const firstInpValue = +firstInput.val();
        const firstInpName = firstInput.attr("name");

        const secondWrapper = $("#exchangeWrapperSecond .currency-wrapper");
        const secondWrapperDropdown = $(
          "#exchangeWrapperSecond .currency-switch"
        );
        const secondInput = $("#inputWrapperSecond input");
        const secondInpValue = +secondInput.val();
        const secondInpName = secondInput.attr("name");

        //first input content update
        updateInput(
          secondInput,
          exchange(secondInpName, firstInpName, secondInpValue, data),
          firstInpName
        );
        firstWrapper.appendTo("#exchangeWrapperSecond");
        firstWrapperDropdown.appendTo("#exchangeWrapperSecond");

        //second input content update
        updateInput(
          firstInput,
          exchange(firstInpName, secondInpName, firstInpValue, data),
          secondInpName
        );
        secondWrapper.appendTo("#exchangeWrapperFirst");
        secondWrapperDropdown.appendTo("#exchangeWrapperFirst");
      });

      $(".currency-switch .currency-item").on("click", function () {
        const parent = $(this).parent();
        const previousSibling = parent.prev();
        const inputWrapper = parent.prev().prev();

        const name = $(this).data("name");
        const image = $(this).data("image");

        let dropdowns = $(".currency-switch");
        dropdowns = dropdowns.not(parent);
        dropdowns.find(`.currency-item.desibled`).removeClass("desibled");
        dropdowns
          .find(`.currency-item[data-name=${name}]`)
          .addClass("desibled");

        $(previousSibling).find(".currency-image").attr("src", image);
        $(previousSibling).find(".currency-name").text(name);
        $(inputWrapper).find("input").attr("name", name);

        const leftInput = $("#inputWrapperFirst").find("input");
        const leftInputName = leftInput.attr("name");
        const rightInput = $("#inputWrapperSecond").find("input");
        const rightInputName = rightInput.attr("name");

        leftInput.val(1000);
        rightInput.val(
          exchange(leftInputName, rightInputName, 1000, data, "send")
        );

        parent.find(".currency-item.active").removeClass("active");
        $(this).addClass("active");
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
        $("#moneyTo").text(addCommas(exchange("rub", "usdt", value, data)));
      });
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

      const data = [
        { x: "2024-01-16", y: 87.91 },
        { x: "2024-01-17", y: 88.16 },
        { x: "2024-01-18", y: 89.05 },
        { x: "2024-01-19", y: 89.28 },
        { x: "2024-01-20", y: 89.49 },
        { x: "2024-01-21", y: 89.43 },
        { x: "2024-01-22", y: 88.48 },
        { x: "2024-01-23", y: 88.17 },
        { x: "2024-01-24", y: 88.62 },
        { x: "2024-01-25", y: 88.72 },
        { x: "2024-01-26", y: 89.49 },
        { x: "2024-01-27", y: 89.99 },
        { x: "2024-01-28", y: 89.91 },
        { x: "2024-01-29", y: 90.16 },
        { x: "2024-01-30", y: 90.11 },
        { x: "2024-01-31", y: 90.29 },
        { x: "2024-02-01", y: 90.4 },
        { x: "2024-02-02", y: 90.76 },
        { x: "2024-02-03", y: 91.13 },
        { x: "2024-02-04", y: 91.03 },
        { x: "2024-02-05", y: 90.92 },
        { x: "2024-02-06", y: 91.44 },
        { x: "2024-02-07", y: 91.32 },
        { x: "2024-02-08", y: 91.63 },
        { x: "2024-02-09", y: 91.82 },
        { x: "2024-02-10", y: 91.81 },
        { x: "2024-02-11", y: 91.7 },
        { x: "2024-02-12", y: 91.26 },
        { x: "2024-02-13", y: 92.02 },
        { x: "2024-02-14", y: 91.44 },
        { x: "2024-02-15", y: 91.51 },
      ];

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
