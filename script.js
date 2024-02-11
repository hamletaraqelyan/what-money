$(() => {
  $(window).on("beforeunload", function () {
    $(window).scrollTop(0);
  });

  //rocket slider
  $(".canvas-range #slider").on("input", (e) => {
    const value = $(e.target).val();
    $(".canvas-rangeBtn").css("left", `${value}%`);
    var transformValue = `scaleX(${value / 100}) translateY(-50%)`;
    $(".canvas-range .dark .dark-overlay").css("transform", transformValue);
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

  //Currency rate
  //   async function getRate() {
  //     const response = await fetch("http://example.com/movies.json");
  //     const rateData = await response.json();
  //     console.log(rateData);
  //     return rateData;
  //   }
});
