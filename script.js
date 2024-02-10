$(() => {
    $(window).on('beforeunload', function () {
        $(window).scrollTop(0);
    });

    //rocket slider
    $(".canvas-range #slider").on('input', (e) => {
        const value = $(e.target).val();
        $(".canvas-rangeBtn").css('left', `${value}%`);
        var transformValue = `scaleX(${value / 100}) translateY(-50%)`;
        $(".canvas-range .dark .dark-overlay").css('transform', transformValue);
    });

    //Chart
    var ctx = document.getElementById('myChart').getContext('2d');

    const data = [];
    let prev = 100;
    for (let i = 0; i < 100; i++) {
        prev += 5 - Math.random() * 10;
        data.push({ x: i, y: prev });
    }

    const totalDuration = 1500;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    var gradient = ctx.createLinearGradient(0, -2000, 0, 300);
    gradient.addColorStop(0, 'rgba(24, 131, 255, 1)');
    gradient.addColorStop(1, 'rgba(24, 131, 255, 0)');

    const config = {
        type: 'line',
        data: {
            datasets: [{
                fill: true,
                backgroundColor: gradient,
                borderWidth: 3,
                borderColor: '#1883FF',
                tension: 0.5,
                radius: 0,
                pointRadius: 0,
                data: data,
            }]
        },
        options: {
            animation,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: false
            },
            scales: {
                x: {
                    type: 'linear',
                    grid: {
                        display: false, // Remove grid lines on the x-axis
                        drawBorder: false // Remove left border
                    },
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0,
                        maxTicksLimit: 6,
                        color: '#090909',
                        font: {
                            size: 14
                        },
                    }
                },
                y: {
                    ticks: {
                        maxTicksLimit: 4,
                        color: '#9D9D9D',
                        font: {
                            size: 14
                        },
                    },
                    grid: {
                        display: false, // Remove grid lines on the y-axis
                        drawBorder: false // Remove left border
                    }
                }
            }
        }
    };

    new Chart(ctx, config);


    //Gsap | Digital revolution 
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".gsap-container", {
        scrollTrigger: {
            trigger: ".gsap-container",
            toggleActions: "restart pause resume complete",
            start: "bottom bottom",
            end: `+=${1.5 * document.querySelector(".gsap-container").offsetHeight}`,
            pin: true,
            toggleClass: {
                targets: ".human",
                className: "show-text-block",
                immediateRender: true
            }
        }
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
        }
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
        }
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
        }
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
        }
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
        }
    });

    //Gsap | Cards animation
    gsap.to(".animated-cards .cards-wrapper", {
        scrollTrigger: {
            trigger: ".animated-cards .cards-wrapper",
            start: "bottom bottom",
            toggleActions: "play none none none",
            toggleClass: {
                targets: ".animated-cards .cards-wrapper",
                className: "slide-cards",
            },
            once: true,
        }
    })

    //Tabs block
    function openTab() {
        var currentTab = $(this).data('tab');

        $(".tabcontent").removeClass("show");
        $(".tablinks").removeClass("active");
        $("#" + currentTab).addClass("show");
        $(this).addClass("active");
    }

    $('#tab1').addClass('show');
    $('.tablinks').eq(0).addClass('active');

    $('.tablinks').on('click', openTab);
});