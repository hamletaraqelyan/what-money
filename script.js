$(() => {
  //   $(window).on("beforeunload", function () {
  //     $(window).scrollTop(0);
  //   });

  //   Currency rate
  const usdToRub = (usd, rate) => {
    return usd * rate;
  };

  const rubToUsd = (rub, rate) => {
    return rub / rate;
  };

  const usdToUsdt = (number) => {
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    let decreasePercentage;

    if (number <= 5000) {
      decreasePercentage = 0.05; // 5%
    } else {
      decreasePercentage = 0.03; // 3%
    }

    // Calculate the decrease amount based on the percentage
    const decreaseAmount = number * decreasePercentage;

    // Decrease the number
    const result = number - decreaseAmount;

    return result;
  };

  const rubToUsdt = (rub, rate) => {
    const usd = rubToUsd(rub, rate);
    return usdToUsdt(usd);
  };

  const usdtToRub = (usdt, rate) => {
    const USD = usdToUsdt(usdt);
    return usdToRub(USD, rate);
  };

  function roundToTwoDecimals(inputNumber) {
    if (inputNumber === 0) {
      return 0;
    }
    // Round the input number to two decimal places
    const roundedNumber = inputNumber.toFixed(2);

    return roundedNumber;
  }

  const exchange = (from, to, value, rate) => {
    if (from === to) {
      return value;
    }

    if (value === 0) {
      return "";
    } else {
      if (from === "rub") {
        if (to === "usd") {
          return roundToTwoDecimals(rubToUsd(value, rate.rubToUsd));
        } else if (to === "usdt") {
          return roundToTwoDecimals(rubToUsdt(value, rate.rubToUsd));
        }
      } else if (from === "usd") {
        if (to === "rub") {
          return roundToTwoDecimals(usdToRub(value, rate.usdToRub));
        } else if (to === "usdt") {
          return roundToTwoDecimals(usdToUsdt(value));
        }
      } else if (from === "usdt") {
        if (to === "rub") {
          return roundToTwoDecimals(usdtToRub(value, rate.usdToRub));
        } else if (to === "usd") {
          return roundToTwoDecimals(usdToUsdt(value));
        }
      }
    }
  };

  const updateInput = (input, newValue, newName) => {
    $(input).attr("name", newName);
    $(input).val(newValue);
  };

  const symbols = {
    usd: "$",
    usdt: "₮",
    rub: "₽",
  };

  $(".currency-wrapper").on("click", (e) => {
    $(e.currentTarget).parent().find(".currency-switch").addClass("show");
  });

  fetch("https://whatmoneyapi.azurewebsites.net/rb")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const RUBtoUSD = data.rubToUsd;

      $("#inputWrapperSecond input").val(
        roundToTwoDecimals(rubToUsdt(1000, RUBtoUSD))
      );
      $("#outMoneyNumber").text(exchange("rub", "usdt", 100000, data));

      $("#inputWrapperFirst input").on("input", function () {
        const val = +$(this).val();
        const name = $(this).attr("name");

        const secondInput = $("#inputWrapperSecond input");
        const secondName = secondInput.attr("name");

        secondInput.val(exchange(name, secondName, val, data));
      });

      $("#inputWrapperSecond input").on("input", function () {
        const val = +$(this).val();
        const name = $(this).attr("name");

        const firstInput = $("#inputWrapperFirst input");
        const firstInputName = firstInput.attr("name");

        firstInput.val(exchange(name, firstInputName, val, data));
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

        // //range input content update
        // $("#titleFrom").text(secondInpName);
        // $("#titleTo").text(firstInpName);

        // $("#investedMoneySymbol").text(symbols[secondInpName]);
        // $("#outMoneySymbol").text(symbols[firstInpName]);

        // const rangeBtn = $(".rangeInputCurrency");
        // rangeBtn.attr("data-from", secondInpName);
        // rangeBtn.attr("data-to", firstInpName);
      });

      $(".currency-switch .currency-item").on("click", function () {
        const parent = $(this).parent();
        const previousSibling = parent.prev();
        const inputWrapper = parent.prev().prev();

        const name = $(this).data("name");
        const image = $(this).data("image");
        const type = $(this).data("type");

        $(previousSibling).find(".currency-image").attr("src", image);
        $(previousSibling).find(".currency-name").text(name);
        $(inputWrapper).find("input").attr("name", name);

        $("#inputWrapperFirst").find("input").val("");
        $("#inputWrapperSecond").find("input").val("");

        parent.find(".currency-item.active").removeClass("active");
        $(this).addClass("active");
        parent.removeClass("show");

        if (type === "from") {
          $("#titleFrom").text(name);
          $("#symbolFrom").text(symbols[name]);
        } else if (type === "to") {
          $("#titleTo").text(name);
        }
      });

      //rocket slider
      $(".canvas-range #slider").on("input", (e) => {
        const value = $(e.target).val();
        $(".canvas-rangeBtn").css("left", `${value / 100000}%`);
        var transformValue = `scaleX(${value / 10000000}) translateY(-50%)`;
        $(".canvas-range .dark .dark-overlay").css("transform", transformValue);

        const from = $(e.target).data("from");
        const to = $(e.target).data("to");

        $("#moneyFrom").text(value);
        $("#moneyTo").text(exchange(from, to, value, data));
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  //Chart
  var ctx = document.getElementById("myChart").getContext("2d");

  const data = [];
  let prev = 100;
  for (let i = 0; i < 100; i++) {
    prev += 5 - Math.random() * 10;
    data.push({ x: i, y: prev });
  }

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

  var gradient = ctx.createLinearGradient(0, -2000, 0, 300);
  gradient.addColorStop(0, "rgba(24, 131, 255, 1)");
  gradient.addColorStop(1, "rgba(24, 131, 255, 0)");

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
          type: "linear",
          grid: {
            display: false, // Remove grid lines on the x-axis
            drawBorder: false, // Remove left border
          },
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 6,
            color: "#090909",
            font: {
              size: 14,
            },
          },
        },
        y: {
          ticks: {
            maxTicksLimit: 4,
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
    var currentTab = $(this).data("tab");

    $(".tabcontent").removeClass("show");
    $(".tablinks").removeClass("active");
    $("#" + currentTab).addClass("show");
    $(this).addClass("active");
  }

  $("#tab1").addClass("show");
  $(".tablinks").eq(0).addClass("active");

  $(".tablinks").on("click", openTab);
});
