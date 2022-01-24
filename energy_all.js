(function (a) {
    "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof exports ? a(require("jquery")) : a(jQuery);
})(function (a) {
    function b(a, b) {
        var c = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function () {
            return a.apply(null, c);
        }, b);
    }
    function c(a, b) {
        b = b || 100;
        return function () {
            if (!a.debouncing) {
                var c = Array.prototype.slice.apply(arguments);
                a.lastReturnVal = a.apply(window, c);
                a.debouncing = !0;
            }
            clearTimeout(a.debounceTimeout);
            a.debounceTimeout = setTimeout(function () {
                a.debouncing = !1;
            }, b);
            return a.lastReturnVal;
        };
    }
    function d(a, b) {
        for (var c = [], e = a.parentNode; 0 === e.offsetWidth && 0 === e.offsetHeight; ) c.push(e), (e = e.parentNode);
        var e = c.length,
            d = [],
            f = a[b];
        if (e) {
            for (f = 0; f < e; f++) (d[f] = c[f].style.display), (c[f].style.display = "block"), (c[f].style.height = "0"), (c[f].style.overflow = "hidden"), (c[f].style.visibility = "hidden");
            for (var f = a[b], g = 0; g < e; g++) (c[g].style.display = d[g]), (c[g].style.height = ""), (c[g].style.overflow = ""), (c[g].style.visibility = "");
        }
        return f;
    }
    function e(e, d) {
        this.$window = a(window);
        this.$document = a(document);
        this.$element = a(e);
        this.options = a.extend({}, g, d);
        this._defaults = g;
        this._name = "rangeslider";
        this.startEvent = this.options.startEvent.join(".rangeslider ") + ".rangeslider";
        this.moveEvent = this.options.moveEvent.join(".rangeslider ") + ".rangeslider";
        this.endEvent = this.options.endEvent.join(".rangeslider ") + ".rangeslider";
        this.polyfill = this.options.polyfill;
        this.onInit = this.options.onInit;
        this.onSlide = this.options.onSlide;
        this.onSlideEnd = this.options.onSlideEnd;
        if (this.polyfill && h) return !1;
        this.identifier = this.$element[0].getAttribute("id") + "-rangeslider";
        this.min = parseFloat(this.$element[0].getAttribute("min") || 0);
        this.max = parseFloat(this.$element[0].getAttribute("max") || 100);
        this.value = parseFloat(this.$element[0].value || this.min + (this.max - this.min) / 2);
        this.step = parseFloat(this.$element[0].getAttribute("step") || 1);
        this.title = this.$element[0].getAttribute("title");
        this.toFixed = (this.step + "").replace(".", "").length - 1;
        this.$fill = a('<div class="' + this.options.fillClass + '" />');
        this.$handle = a('<div class="' + this.options.handleClass + '" />');
        this.$range = a('<div class="' + this.options.rangeClass + '" id="' + this.identifier + '" />')
            .insertAfter(this.$element)
            .prepend(this.$fill, this.$handle);
        this.title && this.$range.attr("title", this.title);
        this.$element.css({ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: "0" });
        this.handleDown = a.proxy(this.handleDown, this);
        this.handleMove = a.proxy(this.handleMove, this);
        this.handleEnd = a.proxy(this.handleEnd, this);
        this.init();
        var f = this;
        this.$window.on(
            "resize.rangeslider",
            c(function () {
                b(function () {
                    f.update();
                }, 300);
            }, 20)
        );
        this.$document.on(this.startEvent, "#" + this.identifier + ":not(." + this.options.disabledClass + ")", this.handleDown);
        this.$element.on("change.rangeslider", function (a, b) {
            if (!b || "rangeslider" !== b.origin) {
                var c = f.getPositionFromValue(a.target.value);
                f.setPosition(c);
            }
        });
    }
    var f = [],
        h = (function () {
            var a = document.createElement("input");
            a.setAttribute("type", "range");
            return "text" !== a.type;
        })(),
        g = {
            polyfill: !0,
            rangeClass: "rangeslider",
            disabledClass: "rangeslider--disabled",
            fillClass: "rangeslider__fill",
            handleClass: "rangeslider__handle",
            startEvent: ["mousedown", "touchstart", "pointerdown"],
            moveEvent: ["mousemove", "touchmove", "pointermove"],
            endEvent: ["mouseup", "touchend", "pointerup"],
        };
    e.prototype.init = function () {
        if (this.onInit && "function" === typeof this.onInit) this.onInit();
        this.update();
    };
    e.prototype.update = function () {
        this.handleWidth = d(this.$handle[0], "offsetWidth");
        this.rangeWidth = d(this.$range[0], "offsetWidth");
        this.maxHandleX = this.rangeWidth - this.handleWidth;
        this.grabX = this.handleWidth / 2;
        this.position = this.getPositionFromValue(this.value);
        this.$element[0].disabled ? this.$range.addClass(this.options.disabledClass) : this.$range.removeClass(this.options.disabledClass);
        this.setPosition(this.position);
    };
    e.prototype.handleDown = function (a) {
        a.preventDefault();
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);
        if (!(-1 < (" " + a.target.className + " ").replace(/[\n\t]/g, " ").indexOf(this.options.handleClass))) {
            a = this.getRelativePosition(a);
            var b = this.$range[0].getBoundingClientRect().left,
                b = this.getPositionFromNode(this.$handle[0]) - b;
            this.setPosition(a - this.grabX);
            a >= b && a < b + this.handleWidth && (this.grabX = a - b);
        }
    };
    e.prototype.handleMove = function (a) {
        a.preventDefault();
        a = this.getRelativePosition(a);
        this.setPosition(a - this.grabX);
    };
    e.prototype.handleEnd = function (a) {
        a.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);
        if (this.onSlideEnd && "function" === typeof this.onSlideEnd) this.onSlideEnd(this.position, this.value);
    };
    e.prototype.cap = function (a, b, c) {
        return a < b ? b : a > c ? c : a;
    };
    e.prototype.setPosition = function (a) {
        var b;
        a = this.getValueFromPosition(this.cap(a, 0, this.maxHandleX));
        b = this.getPositionFromValue(a);
        this.$fill[0].style.width = b + this.grabX + "px";
        this.$handle[0].style.left = b + "px";
        this.setValue(a);
        this.position = b;
        this.value = a;
        if (this.onSlide && "function" === typeof this.onSlide) this.onSlide(b, a);
    };
    e.prototype.getPositionFromNode = function (a) {
        for (var b = 0; null !== a; ) (b += a.offsetLeft), (a = a.offsetParent);
        return b;
    };
    e.prototype.getRelativePosition = function (a) {
        var b = this.$range[0].getBoundingClientRect().left,
            c = 0;
        "undefined" !== typeof a.pageX
            ? (c = a.pageX)
            : "undefined" !== typeof a.originalEvent.clientX
            ? (c = a.originalEvent.clientX)
            : a.originalEvent.touches && a.originalEvent.touches[0] && "undefined" !== typeof a.originalEvent.touches[0].clientX
            ? (c = a.originalEvent.touches[0].clientX)
            : a.currentPoint && "undefined" !== typeof a.currentPoint.x && (c = a.currentPoint.x);
        return c - b;
    };
    e.prototype.getPositionFromValue = function (a) {
        return ((a - this.min) / (this.max - this.min)) * this.maxHandleX;
    };
    e.prototype.getValueFromPosition = function (a) {
        a = this.step * Math.round(((a / (this.maxHandleX || 1)) * (this.max - this.min)) / this.step) + this.min;
        return Number(a.toFixed(this.toFixed));
    };
    e.prototype.setValue = function (a) {
        a !== this.value && this.$element.val(a).trigger("change", { origin: "rangeslider" });
    };
    e.prototype.destroy = function () {
        this.$document.off(this.startEvent, "#" + this.identifier, this.handleDown);
        this.$element.off(".rangeslider").removeAttr("style").removeData("plugin_rangeslider");
        this.$range && this.$range.length && this.$range[0].parentNode.removeChild(this.$range[0]);
        f.splice(f.indexOf(this.$element[0]), 1);
        f.length || this.$window.off(".rangeslider");
    };
    a.fn.rangeslider = function (b) {
        return this.each(function () {
            var c = a(this),
                d = c.data("plugin_rangeslider");
            d || (c.data("plugin_rangeslider", (d = new e(this, b))), f.push(this));
            if ("string" === typeof b) d[b]();
        });
    };
});
String.prototype.trim ||
    (String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    });
function ParamModel() {}
ParamModel.prototype = {
    constructor: ParamModel,
    paramList: {},
    changed: !0,
    setParam: function (a, b) {
        this.paramList[a] = b;
        this.changed = !0;
    },
    getParam: function (a) {
        return this.paramList[a];
    },
    getParams: function () {
        return this.paramList;
    },
    hasChanged: function () {
        return this.changed;
    },
};
function ParamControl() {}
ParamControl.prototype = {
    constructor: ParamControl,
    model: new ParamModel(),
    scenarioSelect: $("#scenarioSelect"),
    customScenarioName: "Custom",
    scenarioLists: [],
    currentScenario: {},
    sendChangeEvents: !0,
    sendChangeEvent: function (a, b) {
        this.sendChangeEvents && $.event.trigger({ type: b ? b : "ParamChangeEvent", message: a });
    },
    addScenario: function (a) {
        var b = a.scenarioName,
            c = $("#scenarioSelect option").length,
            d = "";
        0 == c && (d = 'selected=""');
        b = $('<option value="' + c + '" ' + d + ">" + b + "</option>");
        this.scenarioSelect = $("#scenarioSelect");
        this.scenarioSelect.append(b);
        var e = this;
        this.scenarioLists[c] = a;
        var f = this.scenarioLists;
        0 == c &&
            this.scenarioSelect.bind("change", function (a) {
                a = $(this).find("option:selected");
                a = f[a.val()];
                e.setScenario(a);
            });
    },
    setScenario: function (a) {
        this.sendChangeEvents = !1;
        this.setParams(a);
        this.model.setParam("scenarioName", a.scenarioName);
        this.currentScenario = a;
        this.sendChangeEvents = !0;
        this.sendChangeEvent("scenario=" + a.scenarioName, "ScenarioChangeEvent");
    },
    setModelParam: function (a, b) {
        this.model.setParam(a, b);
        this.model.setParam("scenarioName", this.customScenarioName);
        this.sendChangeEvent(a + "=" + b);
    },
    setParam: function (a, b) {
        var c = this.model;
        if ("scenarioName" == a) c.setParam(a, b);
        else {
            var d = !this.model.getParam(a),
                e = this,
                c = $("input[type=radio][name=" + a + "]");
            0 < c.length
                ? (this.setModelParam(a, b),
                  d &&
                      c.click(function (b) {
                          b = $('input[type="radio"][name=' + a + "]:checked").val();
                          e.setModelParam(a, b);
                      }),
                  $("input[name=" + a + "][value=" + b + "]").prop("checked", !0))
                : (c = $("#" + a)) && c.prop("tagName")
                ? ((d = c.prop("tagName").toLowerCase()),
                  e.setModelParam(a, b),
                  "input" == d
                      ? (c.val(b),
                        c.bind("keyup cut paste input change", function (b) {
                            b = $(this).val();
                            b = parseFloat(b.trim());
                            e.setModelParam(a, b);
                        }))
                      : "select" == d &&
                        (c.val(b),
                        c.bind("change", function (b) {
                            b = parseFloat($(this).val());
                            e.setModelParam(a, b);
                        })))
                : e.setModelParam(a, b);
        }
    },
    setParams: function (a) {
        for (var b in a) this.setParam(b, a[b]);
    },
    getParam: function (a) {
        return this.model.getParam(a);
    },
    hasChanged: function () {
        return this.model.hasChanged();
    },
    listParams: function () {
        console.log("Params: " + JSON.stringify(this.model.getParams()));
    },
};
function EnergyModel() {}
EnergyModel.prototype = {
    constructor: EnergyModel,
    efficiencyFlag: !0,
    sourceLabels: "Oil Coal Gas Biofuel Nuclear Hydro Solar Wind".split(" "),
    otherLabel: "Wind",
    OIL: 0,
    COAL: 1,
    GAS: 2,
    BIOFUEL: 3,
    NUCLEAR: 4,
    HYDRO: 5,
    SOLAR: 6,
    WIND: 7,
    NUM_SOURCES: 8,
    OTHER_INDEX: 7,
    ENERGY_DEMAND_GROWTH: 8,
    ENERGY_DEMAND_GROWTH_MAX: 9,
    ENERGY_EFFICIENCY: 10,
    ENERGY_EFFICIENCY_MAX: 11,
    NUM_PARAMS: 12,
    paramVals: [],
    currentVals: [],
    init: function () {
        for (var a = 0; a < this.NUM_PARAMS; a++) this.currentVals[a] = this.paramVals[a];
    },
    getNextDemand: function (a) {
        var b = this.getAnnualDemandMult(),
            b = Math.pow(b, 10);
        return a * b;
    },
    autoMeetDemand: function (a) {
        var b = this.getAnnualDemandMult(),
            b = Math.pow(b, a),
            b = b + 5e-4;
        for (a = 0; a < this.NUM_SOURCES; a++) this.currentVals[a] *= b;
    },
    getAutoMeetDemandPercent: function () {
        var a = this.getAnnualDemandMult(),
            a = Math.pow(a, 10),
            a = a + 5e-4;
        --a;
        return (a = Math.round(100 * a));
    },
    getAnnualDemandMult: function () {
        var a = 1 + this.currentVals[this.ENERGY_DEMAND_GROWTH];
        this.efficiencyFlag && (a *= 1 - this.currentVals[this.ENERGY_EFFICIENCY]);
        return a;
    },
    getEnergySum: function () {
        for (var a = 0, b = this.OIL; b < this.NUM_SOURCES; b++) a += this.getCurrent(b);
        return a;
    },
    step: function () {},
    getLabel: function (a) {
        return this.sourceLabels[a];
    },
    getSourceIndex: function (a) {
        return this.sourceLabels.indexOf(a);
    },
    setParam: function (a, b) {
        this.paramVals[a] = b;
    },
    getParam: function (a) {
        return this.paramVals[a];
    },
    getCurrent: function (a) {
        return this.currentVals[a];
    },
    setCurrent: function (a, b) {
        this.currentVals[a] = parseFloat(b);
    },
};
function CarbonModel() {}
CarbonModel.prototype = {
    constructor: CarbonModel,
    carbonControl: void 0,
    sequesterFlag: !1,
    meltTundraSwitch: 0,
    MELT_OFF: 0,
    MELT_SIXTH: 1,
    MULT_THIRD: 2,
    INVALID_PPM: -1,
    atmToPPM: -1,
    tundraDelta: 0,
    CARBON_MIN: 0,
    CARBON_MAX: 1,
    CARBON_GOAL: 2,
    CARBON_ATM: 3,
    CARBON_OCEAN_SURFACE: 4,
    CARBON_OCEAN_DEEP: 5,
    CARBON_TERRESTRIAL: 6,
    CARBON_SOILS: 7,
    CARBON_BIOPUMP: 8,
    CARBON_X1: 9,
    CARBON_X2: 10,
    CARBON_X3: 11,
    CARBON_PPM: 12,
    CARBON_START_YEAR: 13,
    CARBON_END_YEAR: 14,
    CARBON_SEQUESTER: 15,
    CARBON_SEQUESTER_UP: 16,
    CARBON_LAST_FOSSIL: 17,
    CARBON_TOTAL: 18,
    CARBON_DEFOREST_MAX: 19,
    CARBON_DEFORESTATION: 20,
    CARBON_TUNDRA_MAX: 21,
    CARBON_TUNDRA_YEARS: 22,
    CARBON_TUNDRA_ACCUM: 23,
    CARBON_OILGAS: 24,
    CARBON_COAL: 25,
    NUM_PARAMS: 26,
    paramVals: [],
    currentVals: [],
    COAL_C: 0.0254,
    OIL_C: 0.0199,
    GAS_C: 0.0144,
    Yr2000AtmCarbonAmount: 620,
    Yr2000SufaceOceanCarbonAmount: 1e3,
    Yr2000DeepOceanCarbonAmount: 38e3,
    Yr2000SoilsCarbonAmount: 2e3,
    Yr2000TerrestrialCarbonAmount: 700,
    Yr2000AtmSurfaceCarbonFlow: 70,
    Yr2000SurfaceToDeepCarbonFlow: 90,
    Yr2000DeepToSurfaceCarbonFlow: 100,
    Yr2000TerrestrialToSoilsCarbonFlow: 50,
    Yr2000SoilsToAtmCarbonFlow: 50,
    Yr2000PhotosynthesisAmount: 100,
    UNLIMITED_SUPPLY: 1e5,
    preinit: function () {
        this.paramVals[this.CARBON_OILGAS] = this.UNLIMITED_SUPPLY;
        this.paramVals[this.CARBON_COAL] = this.UNLIMITED_SUPPLY;
    },
    init: function () {
        this.paramVals[this.CARBON_LAST_FOSSIL] = this.getNewFossilCarbon();
        for (var a = (this.paramVals[this.CARBON_TUNDRA_ACCUM] = 0); a < this.NUM_PARAMS; a++) this.currentVals[a] = this.paramVals[a];
        this.atmToPPM = this.INVALID_PPM;
        this.step(this.currentVals, 0);
        this.tundraDelta = this.paramVals[this.CARBON_TUNDRA_MAX] / this.paramVals[this.CARBON_TUNDRA_YEARS];
        this.tundraDelta /= 2;
        for (a = this.CARBON_ATM; a <= this.CARBON_SOILS; a++) this.currentVals[a] = this.paramVals[a];
    },
    fmt: function (a) {
        if (isNaN(a)) return a;
        a = parseFloat(a);
        return a.toFixed(2);
    },
    traceCarbonPools: function (a) {
        var b = this.currentVals,
            c = this.carbonControl.thisYear;
        a && (c = a);
        console.log(
            "year " +
                c +
                ", demand=" +
                this.fmt(b[this.CARBON_LAST_FOSSIL]) +
                ", atm=" +
                this.fmt(b[this.CARBON_ATM]) +
                ", ppm=" +
                this.fmt(b[this.CARBON_PPM]) +
                ", soil=" +
                this.fmt(b[this.CARBON_SOILS]) +
                ", plant=" +
                this.fmt(b[this.CARBON_TERRESTRIAL]) +
                ", soil=" +
                this.fmt(b[this.CARBON_SOILS]) +
                ", coal=" +
                this.fmt(b[this.CARBON_COAL]) +
                ", oilgas=" +
                this.fmt(b[this.CARBON_OILGAS]) +
                ", surf=" +
                this.fmt(b[this.CARBON_OCEAN_SURFACE]) +
                ", deep=" +
                this.fmt(b[this.CARBON_OCEAN_DEEP])
        );
    },
    stepDecade: function () {
        for (var a = this.getNewFossilCarbon(), b = this.currentVals[this.CARBON_LAST_FOSSIL], c = (a - b) / 10, d = 0, e = 0; 10 > e; e++) d = this.step(this.currentVals, b + e * c);
        this.currentVals[this.CARBON_LAST_FOSSIL] = a;
        return d;
    },
    stepYear: function (a) {
        a = this.stepNewFossilCarbon();
        this.step(this.currentVals, a);
        return (this.currentVals[this.CARBON_LAST_FOSSIL] = a);
    },
    projectDecade: function () {
        for (var a = this.currentVals.slice(0), b = this.getNewFossilCarbon(), c = this.currentVals[this.CARBON_LAST_FOSSIL], b = (b - c) / 10, d, e = 0; 10 > e; e++) d = this.step(a, c + e * b);
        return d;
    },
    stepNewFossilCarbon: function () {
        var a = this.carbonControl.energyModel,
            b = this.OIL_C * a.getCurrent(a.OIL),
            c = this.COAL_C * a.getCurrent(a.COAL),
            d = this.GAS_C * a.getCurrent(a.GAS),
            e = b + d,
            b = c + e,
            d = 0;
        e > this.currentVals[this.CARBON_OILGAS]
            ? ((d = e - this.currentVals[this.CARBON_OILGAS]),
              (this.currentVals[this.CARBON_OILGAS] = 0),
              (e = a.getCurrent(a.OIL) + a.getCurrent(a.COAL) + a.getCurrent(a.GAS)),
              a.setCurrent(a.OIL, 0),
              a.setCurrent(a.GAS, 0),
              (d /= (this.OIL_C + this.GAS_C) / 2),
              (d *= this.COAL_C),
              (c += d),
              a.setCurrent(a.COAL, e))
            : (this.currentVals[this.CARBON_OILGAS] -= e);
        c > this.currentVals[this.CARBON_COAL] ? ((this.currentVals[this.CARBON_COAL] = 0), (d = c - this.currentVals[this.CARBON_COAL]), (b -= d), a.setCurrent(a.COAL, 0)) : (this.currentVals[this.CARBON_COAL] -= c);
        return b;
    },
    getNewFossilCarbon: function () {
        var a = this.carbonControl.energyModel,
            b;
        b = 0 + this.OIL_C * a.getCurrent(a.OIL);
        b += this.COAL_C * a.getCurrent(a.COAL);
        return (b += this.GAS_C * a.getCurrent(a.GAS));
    },
    getNewCoalCarbon: function () {
        var a = this.carbonControl.energyModel;
        return this.COAL_C * a.getCurrent(a.COAL);
    },
    step: function (a, b, c) {
        var d,
            e,
            f = 0,
            h = a[this.CARBON_ATM];
        d = a[this.CARBON_X1];
        var g = a[this.CARBON_X2],
            k = a[this.CARBON_X3],
            m = a[this.CARBON_OCEAN_SURFACE];
        e = a[this.CARBON_OCEAN_DEEP];
        var f = a[this.CARBON_TERRESTRIAL],
            l = a[this.CARBON_SOILS],
            n = a[this.CARBON_BIOPUMP],
            q = a[this.CARBON_DEFORESTATION],
            p = a[this.CARBON_SEQUESTER];
        p > c && ((p = c), (a[this.CARBON_SEQUESTER] = c));
        b -= p;
        0 > b && (b = 0);
        k = (this.Yr2000PhotosynthesisAmount / Math.pow(this.Yr2000AtmCarbonAmount, k)) * Math.pow(h, k);
        c = h + (this.Yr2000AtmSurfaceCarbonFlow / Math.pow(this.Yr2000SufaceOceanCarbonAmount, d)) * Math.pow(m, d);
        c -= (this.Yr2000AtmSurfaceCarbonFlow / this.Yr2000AtmCarbonAmount) * h;
        c = c - 0.5 * k + (this.Yr2000SoilsToAtmCarbonFlow / Math.pow(this.Yr2000SoilsCarbonAmount, g)) * Math.pow(l, g);
        c += b;
        b = m + (this.Yr2000AtmSurfaceCarbonFlow / this.Yr2000AtmCarbonAmount) * h;
        b -= (this.Yr2000AtmSurfaceCarbonFlow / Math.pow(this.Yr2000SufaceOceanCarbonAmount, d)) * Math.pow(m, d);
        b += (this.Yr2000DeepToSurfaceCarbonFlow / this.Yr2000DeepOceanCarbonAmount) * 1 * e;
        b -= (this.Yr2000SurfaceToDeepCarbonFlow / this.Yr2000SufaceOceanCarbonAmount) * 1 * m;
        b -= n;
        d = e + (this.Yr2000SurfaceToDeepCarbonFlow / this.Yr2000SufaceOceanCarbonAmount) * 1 * m;
        d -= (this.Yr2000DeepToSurfaceCarbonFlow / this.Yr2000DeepOceanCarbonAmount) * 1 * e;
        d += n;
        this.atmToPPM == this.INVALID_PPM && (this.atmToPPM = a[this.CARBON_PPM] / c);
        c += q;
        e = f - q + 0.5 * k;
        e -= (this.Yr2000TerrestrialToSoilsCarbonFlow / this.Yr2000TerrestrialCarbonAmount) * f;
        f = l + (this.Yr2000TerrestrialToSoilsCarbonFlow / this.Yr2000TerrestrialCarbonAmount) * f;
        f -= (this.Yr2000SoilsToAtmCarbonFlow / Math.pow(this.Yr2000SoilsCarbonAmount, g)) * Math.pow(l, g);
        this.meltTundraSwitch != this.MELT_OFF &&
            (this.meltTundraSwitch == this.MELT_SIXTH
                ? ((g = a[this.CARBON_TUNDRA_ACCUM]),
                  (l = a[this.CARBON_TUNDRA_MAX] / 2),
                  (0 > this.tundraDelta && 0 >= g) || ((g += this.tundraDelta), (c += g), (f -= g), g >= l && (this.tundraDelta = -Math.abs(this.tundraDelta)), (a[this.CARBON_TUNDRA_ACCUM] = g)))
                : ((g = a[this.CARBON_TUNDRA_ACCUM]), (l = a[this.CARBON_TUNDRA_MAX]), (g += this.tundraDelta), g <= l + 0.01 && ((c += g), (f -= g), (a[this.CARBON_TUNDRA_ACCUM] = g))));
        a[this.CARBON_ATM] = c;
        a[this.CARBON_OCEAN_SURFACE] = b;
        a[this.CARBON_OCEAN_DEEP] = d;
        a[this.CARBON_TERRESTRIAL] = e;
        a[this.CARBON_SOILS] = f;
        a[this.CARBON_PPM] = c * this.atmToPPM;
        return a[this.CARBON_PPM];
    },
    setParam: function (a, b) {
        this.paramVals[a] = b;
    },
    getParam: function (a) {
        return this.paramVals[a];
    },
    getCurrent: function (a) {
        return this.currentVals[a];
    },
    setCurrent: function (a, b) {
        this.currentVals[a] = b;
    },
};
function StatusLamp() {
    this.GOOD = 0;
    this.WARN = 1;
    this.STOP = 2;
    this.HAPPY_FACE = 3;
    this.NO_COMMENT = "";
    this.statusValue = 0;
    this.init = function () {
        setStatus(GOOD, NO_COMMENT, NO_COMMENT);
    };
    this.getStatus = function () {
        return this.statusValue;
    };
    this.setStatus = function (a, b, c) {
        this.statusValue = a;
        b = b || this.NO_COMMENT;
        c = c || this.NO_COMMENT;
        this.statusValue == this.GOOD
            ? b !== this.NO_COMMENT
                ? $("#statusLamp").attr("class", "icon-info-sign")
                : $("#statusLamp").attr("class", "")
            : (this.statusValue == this.WARN
                  ? $("#statusLamp").attr("class", "icon-warning-sign").addClass("warn")
                  : this.statusValue == this.HAPPY_FACE
                  ? $("#statusLamp").attr("class", "icon-bolt").addClass("go")
                  : $("#statusLamp").attr("class", "icon-ban-circle").addClass("stop"),
              $("#statusLamp").show());
        $("#energyWarningLine1").html(b);
        $("#energyWarningLine2").html(c);
    };
}
function LineValueChecker() {
    this.energyControl = void 0;
    this.DEF_MIN_MAX = 1;
    this.sliderMin = -this.DEF_MIN_MAX;
    this.sliderMax = 1 + this.DEF_MIN_MAX;
    this.sliderPerFraction = void 0;
    this.enforceMaxFlag = !0;
    this.statusValue;
    this.line1;
    this.line2;
    this.maxLine1;
    this.maxLine2;
    this.init = function (a, b, c, d, e, f) {
        this.energyControl = a;
        this.setParams(b, c, e, f);
        this.enforceMaxFlag = d;
        this.clearStatus();
    };
    this.getSliderPosn = function (a, b) {
        var c = a / b;
        c < this.sliderMin && (c = this.sliderMin);
        c > this.sliderMax && (c = this.sliderMax);
        return this.fractionToSliderVal(c);
    };
    this.fractionToSliderVal = function (a) {
        return (a - this.sliderMin) * this.sliderPerFraction;
    };
    this.sliderValToFraction = function (a) {
        return this.sliderMin + a / this.sliderPerFraction;
    };
    this.setParams = function (a, b, c, d) {
        this.sliderMin = a;
        this.sliderMax = b;
        this.maxLine1 = c;
        this.maxLine2 = d;
        this.sliderPerFraction = 100 / (this.sliderMax - this.sliderMin);
    };
    this.checkValue = function (a, b) {
        this.clearStatus();
        0 > a && (a = 0);
        if (this.isBelow(a, b, this.sliderMax)) return a;
        var c = a;
        this.enforceMaxFlag && !this.energyControl.ignoreMax && (c = this.sliderMax * b);
        this.setMaxStatus();
        return c;
    };
    this.isBelow = function (a, b, c) {
        a /= b;
        return a + a / 100 < c;
    };
    this.setStatusLamp = function (a) {
        a.setStatus(this.statusValue, this.line1, this.line2);
    };
    this.setEnforceMax = function (a) {
        this.enforceMaxFlag = a;
    };
    this.clearStatus = function () {
        var a = this.energyControl.energyPopup.statusLamp;
        this.statusValue = a.GOOD;
        this.line2 = this.line1 = a.NO_COMMENT;
    };
    this.setMaxStatus = function () {
        var a = this.energyControl.energyPopup.statusLamp;
        this.statusValue = this.enforceMaxFlag ? a.WARN : a.GOOD;
        this.line1 = this.maxLine1;
        this.line2 = this.maxLine2;
    };
}
function TentValueChecker() {
    var a = new LineValueChecker();
    a.superInit = a.init;
    a.init = function (b, c, d, e, f, h, g, k, m, l) {
        a.superInit(b, c, d, !0, e, f);
        this.upSliderMin = c;
        this.upSliderMax = d;
        this.upMaxLine1 = e;
        this.upMaxLine2 = f;
        this.turnYear = h;
        this.downSliderMin = g;
        this.downSliderMax = k;
        this.downMaxLine1 = m;
        this.downMaxLine2 = l;
    };
    a.superCheckValue = a.checkValue;
    a.checkValue = function (b, c) {
        this.energyControl.getNextYear() > this.turnYear ? this.setParams(this.downSliderMin, this.downSliderMax, this.downMaxLine1, this.downMaxLine2) : this.setParams(this.upSliderMin, this.upSliderMax, this.upMaxLine1, this.upMaxLine2);
        return a.superCheckValue(b, c);
    };
    return a;
}
function BioValueChecker() {
    var a = new LineValueChecker();
    a.superInit = a.init;
    a.init = function (b, c, d, e, f, h, g) {
        var k = b.energyModel,
            k = k.getCurrent(k.BIOFUEL);
        this.preSliderMax = f / k;
        a.superInit(b, c, this.preSliderMax, !1, d, e);
        this.preSliderMin = c;
        this.preMaxLine1 = d;
        this.preMaxLine2 = e;
        this.hardMax = f;
        this.hardMaxLine1 = h;
        this.hardMaxLine2 = g;
    };
    a.superCheckValue = a.checkValue;
    a.checkValue = function (b, c) {
        var d = !1;
        b > this.hardMax && !this.energyControl.ignoreMax && ((b = this.hardMax), (d = !0));
        c * this.preSliderMax >= this.hardMax
            ? (this.setParams(this.preSliderMin, this.hardMax / c, this.hardMaxLine1, this.hardMaxLine2), this.setEnforceMax(!0))
            : (this.setParams(this.preSliderMin, this.preSliderMax, this.preMaxLine1, this.preMaxLine2), this.setEnforceMax(!1));
        var e = a.superCheckValue(b, c),
            f = this.energyControl.energyPopup.statusLamp;
        d && (this.status = f.WARN);
        return e;
    };
    return a;
}
function NuclearValueChecker() {
    var a = new LineValueChecker();
    a.superInit = a.init;
    a.init = function (b, c, d, e, f, h, g) {
        a.superInit(b, c, d, !0, e, f);
        this.warnPercentTotal = h;
        this.warnLine1 = g;
    };
    a.superCheckValue = a.checkValue;
    a.checkValue = function (b, c) {
        var d = a.superCheckValue(b, c),
            e = this.energyControl.energyModel.getEnergySum();
        b / e > this.warnPercentTotal && this.setNuclearStatus();
        return d;
    };
    a.setNuclearStatus = function (a) {
        a = this.energyControl.energyPopup.statusLamp;
        this.statusValue == a.WARN ? (this.line2 = this.warnLine1) : ((this.statusValue = a.WARN), (this.line1 = this.warnLine1), (this.line2 = a.NO_COMMENT));
    };
    return a;
}
function HydroValueChecker() {
    var a = new LineValueChecker();
    a.superInit = a.init;
    a.init = function (b, c, d, e, f, h, g, k) {
        a.superInit(b, c, d, !0, e, f);
        this.preSliderMin = c;
        this.preSliderMax = d;
        this.preMaxLine1 = e;
        this.preMaxLine2 = f;
        this.hardMax = h;
        this.hardMaxLine1 = g;
        this.hardMaxLine2 = k;
    };
    a.superCheckValue = a.checkValue;
    a.checkValue = function (b, c) {
        if (c * this.preSliderMax >= this.hardMax) this.setParams(this.preSliderMin, this.hardMax / c, this.hardMaxLine1, this.hardMaxLine2), this.setEnforceMax(!0);
        else {
            if (b > this.hardMax && !this.energyControl.ignoreMax) return (b = this.hardMax), this.setEnforceMax(!0), this.setMaxStatus(), b;
            this.setParams(this.preSliderMin, this.preSliderMax, this.preMaxLine1, this.preMaxLine2);
            this.setEnforceMax(!1);
        }
        return a.superCheckValue(b, c);
    };
    return a;
}
function WindValueChecker() {
    var a = new LineValueChecker();
    a.superInit = a.init;
    a.init = function (b, c, d, e, f, h, g, k, m, l) {
        this.noSliderMin = c;
        this.noMaxLine1 = d;
        this.noMaxLine2 = e;
        this.warnPercentTotal = f;
        this.absMax = h;
        this.highSliderMin = g;
        this.highSliderMax = k;
        this.highMaxLine1 = m;
        this.highMaxLine2 = l;
        e = b.energyModel;
        d = b.getNextDemand();
        e = e.getCurrent(e.WIND);
        this.noSliderMax = (d * f) / e;
        a.superInit(b, c, this.noSliderMax, !1, this.maxLine1, this.maxLine2);
    };
    a.superCheckValue = a.checkValue;
    a.checkValue = function (b, c) {
        var d = this.energyControl,
            e = d.getNextDemand();
        if (c >= this.warnPercentTotal * e - 0.1)
            return (e = this.highSliderMax), c * this.highSliderMax > this.absMax && (e = this.absMax / c), this.setParams(this.highSliderMin, e, this.highMaxLine1, this.highMaxLine2), this.setEnforceMax(!0), a.superCheckValue(b, c);
        e = this.warnPercentTotal * (e - c) + (this.highSliderMax - 1) * c;
        e > this.absMax && (e = this.absMax);
        e = Math.max(e, this.highSliderMax * c);
        e = parseFloat(d.energyPopup.formatEJ(e));
        b > e && !d.ignoreMax && (b = e);
        d = c * this.noSliderMax;
        if (d > e) return this.setParams(this.highSliderMin, e / c, this.highMaxLine1, this.highMaxLine2), this.setEnforceMax(!0), a.superCheckValue(b, c);
        this.setParams(this.noSliderMin, this.noSliderMax, this.noMaxLine1, this.noMaxLine2);
        this.setEnforceMax(!1);
        d = a.superCheckValue(b, c);
        d >= this.absMax
            ? ((e = this.energyControl.energyPopup.statusLamp), (this.statusValue = e.WARN), (this.line1 = this.noMaxLine1), (this.line2 = e.NO_COMMENT))
            : d >= 0.995 * e && ((e = this.energyControl.energyPopup.statusLamp), (this.statusValue = e.WARN), (this.line1 = this.highMaxLine1), (this.line2 = this.highMaxLine2));
        return d;
    };
    return a;
}
function AdjustEnergySources() {
    this.statusLamp = this.energyControl = void 0;
    this.autoMeetMessageFlag = !1;
    this.lineData = void 0;
    this.shortfall_txt = "";
    this.revertEnergy = null;
    this.alreadySetting = !1;
    this.BIOFUEL_MAX = 500;
    this.OIL_UP = 0.1;
    this.OIL_TURN = 2020;
    this.COAL_UP = 0.4;
    this.GAS_UP = 0.15;
    this.GAS_TURN = 2030;
    this.NUCLEAR_UP = 0.3;
    this.HYDRO_MAX = 100;
    this.HYDRO_UP = 0.25;
    this.SOLAR_UP = 0.3;
    this.WIND_UP = 0.35;
    this.init = function (a) {
        this.energyControl = a;
        this.statusLamp = new StatusLamp();
        this.statusLamp.setStatus(this.statusLamp.GOOD);
        this.setParams();
        this.createLineData();
        this.addSliderListeners();
    };
    this.setParams = function () {
        var a = this.energyControl.params.constrain;
        this.BIOFUEL_MAX = parseFloat(a.biofuelMax);
        this.OIL_UP = parseFloat(a.oilUp);
        this.OIL_TURN = parseFloat(a.oilTurn);
        this.COAL_UP = parseFloat(a.coalUp);
        this.GAS_UP = parseFloat(a.gasUp);
        this.GAS_TURN = parseFloat(a.gasTurn);
        this.NUCLEAR_UP = parseFloat(a.nuclearUp);
        this.HYDRO_MAX = parseFloat(a.hydroMax);
        this.HYDRO_UP = parseFloat(a.hydroUp);
        this.SOLAR_UP = parseFloat(a.solarUp);
        this.WIND_UP = parseFloat(a.windUp);
    };
    this.addSliderListeners = function () {
        var a = this,
            b = this.energyControl,
            c = b.energyModel;
        a.alreadySetting = !1;
        $.each(a.lineData, function (d, e) {
            var f = e.name,
                h = $("#slider" + f);
            h.bind("change", function (d) {
                e = a.lineData[e.lineNumber];
                d = h.val();
                d = a.sliderValueToEJ(e, d);
                d = a.formatEJ(d);
                c.setCurrent(e.lineNumber, d);
                a.alreadySetting || ((a.alreadySetting = !0), a.resumTableOne(e.lineNumber), b.livePlotUpdate && b.updateStatus(), (a.alreadySetting = !1));
                a.resetStatus(e.lineNumber);
            });
            var g = $("#text" + f);
            g.bind("change", function (d) {
                e = a.lineData[e.lineNumber];
                var f = (d = g.val());
                !isNaN(parseFloat(f)) && isFinite(f) && 0 <= f
                    ? ((d = a.formatEJ(d)),
                      (a.alreadySetting = !0),
                      c.setCurrent(e.lineNumber, d),
                      a.setSliderValue(e, d, e.lastValue),
                      $("#slider" + e.name).change(),
                      g.val(a.formatEJ(d)),
                      c.setCurrent(e.lineNumber, d),
                      a.resumTableOne(e.lineNumber),
                      (a.alreadySetting = !1),
                      a.resetStatus(e.lineNumber),
                      b.livePlotUpdate && b.updateStatus())
                    : ((d = c.getCurrent(e.lineNumber)), g.val(a.formatEJ(d)));
            });
            h.closest("tr").hover(
                function () {
                    $(this).addClass("focusRow");
                    a.resetStatus(e.lineNumber);
                },
                function () {
                    $(this).removeClass("focusRow");
                }
            );
        });
    };
    this.doOK = function () {
        var a = this.energyControl;
        a.livePlotUpdate || a.updateStatus();
        this.alreadySetting = !1;
    };
    this.revert = function () {
        for (var a = this.energyControl, b = a.energyModel, c = 0; c < b.NUM_SOURCES; c++) b.setCurrent(c, this.revertEnergy[c]);
        a.updateStatus();
    };
    this.reportAutoMet = function () {
        var a = this.energyControl,
            b = a.energyModel;
        this.autoMeetMessageFlag = !0;
        var c = a.getUnmetDemand(),
            d = this.statusLamp.GOOD;
        0 < c && a.mustMeetDemand && (d = this.statusLamp.WARN);
        a = b.getAutoMeetDemandPercent();
        this.statusLamp.setStatus(d, "Tried adding " + a + "% to all sources.", "Please fine-adjust.");
    };
    this.resetStatus = function (a) {
        null === a ? this.statusLamp.setStatus(this.statusLamp.GOOD) : this.lineData[a].checker.setStatusLamp(this.statusLamp);
    };
    this.resumTable = function () {
        var a = this.energyControl,
            b = a.energyModel;
        this.runCheckers();
        var c = b.getEnergySum();
        a.getNextDemand();
        c = this.formatEJ(c);
        $("#EJTotal").html(c);
        for (a = 0; a < b.NUM_SOURCES; a++) {
            var d = b.getCurrent(a);
            this.setLineFraction(this.lineData[a].name, d / c);
        }
        this.checkShortFall();
    };
    this.resumTableOne = function (a) {
        var b = this.energyControl,
            c = b.energyModel;
        this.setLineValue(a, c.getCurrent(a));
        a = c.getEnergySum();
        b.getNextDemand();
        a = this.formatEJ(a);
        $("#EJTotal").html(a);
        for (b = 0; b < c.NUM_SOURCES; b++) {
            var d = c.getCurrent(b);
            this.setLineFraction(this.lineData[b].name, d / a);
        }
        this.checkShortFall();
    };
    this.formatEJ = function (a) {
        typeof a !== Number && (a = parseFloat(a));
        return 2.5 < a ? a.toFixed(1) : a.toFixed(2);
    };
    this.setLineFraction = function (a, b) {
        $("#percent" + a).html("" + Math.round(100 * b));
    };
    this.sliderValueToEJ = function (a, b) {
        return a.checker.sliderValToFraction(b) * a.lastValue;
    };
    this.createLineData = function () {
        var a = this.energyControl.energyModel;
        this.lineData = [];
        var b = 0,
            c = "",
            d = a.getEnergySum();
        $("#EJTotal").html(this.formatEJ(d));
        for (var e = this.makeCheckers(), f = 0; f < a.NUM_SOURCES; f++) (b = a.getCurrent(f)), (c = a.getLabel(f)), this.setLineFraction(c, b / d), this.lineData.push({ name: c, lineNumber: f, lastValue: b, checker: e[f], coalFlag: !1 });
        this.lineData[a.COAL].coalFlag = !0;
    };
    this.makeCheckers = function () {
        var a = this.energyControl.energyModel,
            b = Array(a.NUM_SOURCES);
        b[a.OIL] = new TentValueChecker();
        b[a.OIL].init(
            this.energyControl,
            1 - this.OIL_UP,
            1 + this.OIL_UP,
            "Max increase " + 100 * this.OIL_UP + "% per decade to " + this.OIL_TURN,
            "after that, must decrease 10%",
            this.OIL_TURN,
            0.7,
            0.9,
            "After " + this.OIL_TURN + ", must decrease 10% per decade",
            this.statusLamp.NO_COMMENT
        );
        b[a.COAL] = new LineValueChecker();
        b[a.COAL].init(this.energyControl, 1 - this.COAL_UP, 1 + this.COAL_UP, !0, "Max increase " + 100 * this.COAL_UP + "% per decade", this.statusLamp.NO_COMMENT);
        b[a.GAS] = new TentValueChecker();
        b[a.GAS].init(
            this.energyControl,
            1 - this.GAS_UP,
            1 + this.GAS_UP,
            "Max increase " + 100 * this.GAS_UP + "% per decade to " + this.GAS_TURN,
            "after that, must decrease 10%",
            this.GAS_TURN,
            0.7,
            0.9,
            "After " + this.GAS_TURN + ", must decrease 10% per decade",
            this.statusLamp.NO_COMMENT
        );
        b[a.BIOFUEL] = new BioValueChecker();
        b[a.BIOFUEL].init(this.energyControl, 0, "Total biofuel max is " + this.BIOFUEL_MAX + " EJ", "no increase limit per decade", this.BIOFUEL_MAX, "Maximum capacity is " + this.BIOFUEL_MAX + " EJ", this.statusLamp.NO_COMMENT);
        b[a.NUCLEAR] = new NuclearValueChecker();
        b[a.NUCLEAR].init(this.energyControl, 1 - this.NUCLEAR_UP, 1 + this.NUCLEAR_UP, "Max increase " + 100 * this.NUCLEAR_UP + "% per decade", this.statusLamp.NO_COMMENT, 0.2, "Beware nuclear proliferation issues.");
        b[a.HYDRO] = new HydroValueChecker();
        b[a.HYDRO].init(
            this.energyControl,
            1 - this.HYDRO_UP,
            1 + this.HYDRO_UP,
            "Max increase " + 100 * this.HYDRO_UP + "% per decade",
            "to a maximum of " + this.HYDRO_MAX + " EJ",
            this.HYDRO_MAX,
            "Maximum capacity is " + this.HYDRO_MAX + " EJ",
            this.statusLamp.NO_COMMENT
        );
        b[a.SOLAR] = new WindValueChecker();
        b[a.SOLAR].init(
            this.energyControl,
            0,
            "Unlimited total capacity",
            "increase limit 5% of total energy",
            0.05,
            1e3,
            1 - this.WIND_UP,
            1 + this.SOLAR_UP,
            "Max increase " + 100 * this.SOLAR_UP + "% per decade",
            "when solar > 5% of total energy"
        );
        b[a.WIND] = new WindValueChecker();
        b[a.WIND].init(
            this.energyControl,
            0,
            "Maximum capacity is 600 EJ",
            "increase limit 5% of total energy",
            0.05,
            600,
            1 - this.WIND_UP,
            1 + this.WIND_UP,
            "Max increase " + 100 * this.WIND_UP + "% per decade",
            "when wind > 5% of total energy"
        );
        return b;
    };
    this.checkShortFall = function () {
        var a = this.energyControl,
            b = a.energyModel.getEnergySum(),
            a = a.getNextDemand(),
            b = a - b;
        0.05 > b && (b = 0);
        b = b.toFixed(1);
        0 < b ? $("#tableComment").html("Need " + b + " EJ more energy.") : $("#tableComment").html("Met demand for " + this.formatEJ(a) + " EJ energy.");
        return b;
    };
    this.setLastValues = function () {
        for (var a = this.energyControl.energyModel, b = 0; b < a.NUM_SOURCES; b++) {
            var c = a.getCurrent(b);
            this.lineData[b].lastValue = c;
        }
    };
    this.getLastValueSum = function () {
        for (var a = this.energyControl.energyModel, b = 0, c = 0; c < a.NUM_SOURCES; c++) b += this.lineData[c].lastValue;
        return b;
    };
    this.runCheckers = function () {
        for (var a = this.energyControl.energyModel, b = 0; b < a.NUM_SOURCES; b++) this.setLineValue(b, a.getCurrent(b));
    };
    this.setSliderValue = function (a, b, c) {
        if (void 0 != a.checker) {
            var d = a.checker.getSliderPosn(c, c);
            b = a.checker.getSliderPosn(b, c);
            $("#slider" + a.name + "-rangeslider .lastValMarker")
                .css({ left: this.fractionToPercent(d) })
                .attr("title", "Last value was " + c);
            $slider = $("#slider" + a.name);
            $slider.val(b);
        }
    };
    this.fractionToPercent = function (a) {
        return 5 + 0.9 * a + "%";
    };
    this.setLineValue = function (a, b) {
        var c = this.energyControl.energyModel,
            d = this.formatEJ(b),
            e = this.lineData[a];
        if (void 0 !== e.checker) {
            var d = e.checker.checkValue(d, e.lastValue),
                f = "#slider" + e.name + "-rangeslider .rangeslider__handle";
            $(f).removeClass("warn");
            e.checker.statusValue !== this.statusLamp.GOOD && $(f).addClass("warn");
            e.checker.setStatusLamp(this.statusLamp);
        }
        d = this.formatEJ(d);
        d = parseFloat(d);
        $("#text" + e.name).val(d);
        this.setSliderValue(e, d, e.lastValue);
        c.setCurrent(a, d);
        return d;
    };
    this.onShow = function () {
        var a = this.energyControl,
            b = a.energyModel;
        this.alreadySetting = !0;
        $("#livePlotUpdateCB").prop("checked", a.livePlotUpdate);
        this.revertEnergy = Array(b.NUM_SOURCES);
        for (var c = 0; c < b.NUM_SOURCES; c++) this.revertEnergy[c] = b.getCurrent(c);
        this.resumTable();
        this.alreadySetting = !0;
        for (c = 0; c < b.NUM_SOURCES; c++) $("#slider" + this.lineData[c].name).change();
        this.alreadySetting = !1;
        (a.autoMeetDemand && this.autoMeetMessageFlag) || this.resetStatus(null);
        this.alreadySetting = this.autoMeetMessageFlag = !1;
    };
}
function Setter() {
    this.textSelector = "#textSetter";
    this.slideSelector = "#sliderSetter";
    this.percentFlag = !0;
    this.minVal = 0;
    this.maxVal = 5;
    this.sliderMin = 0;
    this.sliderMax = 100;
    this.sigdig = 1;
    this.textCallingFlag = !1;
    this.init = function (a, b, c, d, e) {
        this.textSelector = a;
        this.slideSelector = b;
        this.minVal = c;
        this.maxVal = d;
        this.sigdig = e;
        var f = this;
        b = $(b);
        this.sliderMin = b.attr("min");
        this.sliderMax = b.attr("max");
        var h = $(a);
        b.bind("change", function (a) {
            f.textCallingFlag || ((a = f.getSliderValue()), f.percentFlag && (a *= 100), (a = a.toFixed(f.sigdig)), h.val(a).change());
        });
        h.bind("change", function (a) {
            if (!f.textCallingFlag) {
                a = h.val();
                f.textCallingFlag = !0;
                var b = a;
                !isNaN(parseFloat(b)) && isFinite(b) ? (f.percentFlag && (a /= 100), f.setValue(a)) : h.val(f.getSliderValue());
                f.textCallingFlag = !1;
            }
        });
    };
    this.getSliderValue = function () {
        var a = $(this.slideSelector).val();
        return (a = this.minVal + (this.sliderMin + a / (this.sliderMax - this.sliderMin)) * (this.maxVal - this.minVal));
    };
    this.setSliderValue = function (a, b) {
        var c = this.sliderMax - this.sliderMin,
            c = c * ((a - this.minVal) / (this.maxVal - this.minVal) - this.sliderMin);
        $(this.slideSelector).val(c).change();
        if ("undefined" !== typeof b) {
            b = this.enforceLimits(b);
            var c = this.maxVal - this.minVal,
                c = (b - this.minVal) / c,
                d = this.slideSelector + "-rangeslider";
            this.percentFlag && (b *= 100);
            b.toFixed(this.sigdig);
            $(d + " .lastValMarker")
                .attr("title", "Last value was " + b)
                .css({ left: this.fractionToPercent(c) });
        }
    };
    this.fractionToPercent = function (a) {
        a = 2 + 96 * a;
        return a + "%";
    };
    this.getValue = function () {
        var a = 100;
        this.percentFlag || (a = 1);
        return parseFloat($(this.textSelector).val()) / a;
    };
    this.setValue = function (a, b) {
        a = this.enforceLimits(a);
        "undefined" !== typeof b && (b = this.enforceLimits(b));
        this.textCallingFlag = !0;
        this.setTextValue(a);
        this.setSliderValue(a, b);
        this.textCallingFlag = !1;
        return a;
    };
    this.setTextValue = function (a) {
        var b = 100;
        this.percentFlag || (b = 1);
        $(this.textSelector)
            .val((a * b).toFixed(this.sigdig))
            .change();
    };
    this.enforceLimits = function (a) {
        a < this.minVal && (a = this.minVal);
        a > this.maxVal && (a = this.maxVal);
        return a;
    };
}
function AdvancedOptions() {
    this.revertValues = this.energyControl = void 0;
    this.DEMAND = 0;
    this.EFFICIENCY = 1;
    this.SEQUESTER = 2;
    this.AUTOMEET = 3;
    this.MUSTMEET = 4;
    this.IGNOREMAX = 5;
    this.NUM_REVERT = this.IGNOREMAX + 1;
    this.sequesterSetter = this.efficiencySetter = this.demandSetter = void 0;
    this.init = function (a) {
        this.energyControl = a;
        var b = this;
        a = this.energyControl;
        this.setCheckbox("#checkAutoDemand", a.autoMeetDemand);
        this.setCheckbox("#checkMustDemand", a.mustMeetDemand);
        this.setCheckbox("#checkEnforceMax", !a.ignoreMax);
        $("#checkAutoDemand").click(function () {
            b.energyControl.autoMeetDemand = this.checked;
        });
        $("#checkMustDemand").click(function () {
            b.energyControl.mustMeetDemand = this.checked;
        });
        $("#checkEnforceMax").click(function () {
            b.energyControl.ignoreMax = !this.checked;
        });
        this.makeSetters();
        this.setNetDemand();
    };
    this.reinit = function () {
        var a = this.energyControl,
            b = a.energyModel,
            c = a.carbonModel;
        this.setSetter(this.demandSetter, b.getParam(b.ENERGY_DEMAND_GROWTH));
        this.setSetter(this.efficiencySetter, b.getParam(b.ENERGY_EFFICIENCY));
        this.setCheckbox("#checkAutoDemand", a.autoMeetDemand);
        this.setCheckbox("#checkMustDemand", a.mustMeetDemand);
        this.setCheckbox("#checkEnforceMax", !a.ignoreMax);
        this.sequesterSetter.minVal = 0;
        this.sequesterSetter.maxVal = c.getParam(c.CARBON_SEQUESTER_UP);
        this.setSetter(this.sequesterSetter, c.getParam(c.CARBON_SEQUESTER));
    };
    this.onEnergyChange = function () {
        var a = this.energyControl,
            b = a.energyModel,
            c = a.carbonModel;
        b.setCurrent(b.ENERGY_DEMAND_GROWTH, this.demandSetter.getValue());
        b.setCurrent(b.ENERGY_EFFICIENCY, this.efficiencySetter.getValue());
        c.setCurrent(c.CARBON_SEQUESTER, this.sequesterSetter.getValue());
        this.setNetDemand();
        a.livePlotUpdate && a.updateStatus();
    };
    this.onStep = function () {
        this.updateSequesterRange();
    };
    this.makeSetters = function () {
        var a = this,
            b = this.energyControl.energyModel,
            c = this.energyControl.carbonModel,
            d = b.getParam(b.ENERGY_DEMAND_GROWTH_MAX),
            e = b.getParam(b.ENERGY_DEMAND_GROWTH);
        this.demandSetter = new Setter();
        this.demandSetter.init("#textDemandChange", "#sliderDemandChange", -d, d, 1);
        this.demandSetter.setValue(e, e);
        d = b.getParam(b.ENERGY_EFFICIENCY_MAX);
        e = b.getParam(b.ENERGY_EFFICIENCY);
        this.efficiencySetter = new Setter();
        this.efficiencySetter.init("#textEfficiencyChange", "#sliderEfficiencyChange", 0, d, 2, this.onEnergyChange);
        this.efficiencySetter.setValue(e, e);
        d = c.getParam(c.CARBON_SEQUESTER_UP);
        e = c.getParam(c.CARBON_SEQUESTER);
        this.sequesterSetter = new Setter();
        this.sequesterSetter.init("#textCarbonCapture", "#sliderCarbonCapture", 0, d, 1);
        this.sequesterSetter.percentFlag = !1;
        this.sequesterSetter.setValue(e, e);
        $("#textDemandChange, #textEfficiencyChange, #textCarbonCapture").bind("change", function (b) {
            a.onEnergyChange();
        });
    };
    this.setNetDemand = function () {
        var a = this.energyControl.energyModel.getAnnualDemandMult(),
            a = Math.pow(a, this.energyControl.timeStep);
        --a;
        a *= 100;
        $("#netEnergyDemandChange").html(a.toFixed(1) + " %");
    };
    this.setSetter = function (a, b) {
        return a.setValue(b, b);
    };
    this.setCheckbox = function (a, b) {
        $(a).prop("checked", b);
        return b;
    };
    this.onShow = function () {
        var a = this.energyControl,
            b = a.energyModel,
            c = a.carbonModel;
        this.revertValues = [];
        this.revertValues[this.DEMAND] = this.setSetter(this.demandSetter, b.getCurrent(b.ENERGY_DEMAND_GROWTH));
        this.revertValues[this.EFFICIENCY] = this.setSetter(this.efficiencySetter, b.getCurrent(b.ENERGY_EFFICIENCY));
        this.revertValues[this.SEQUESTER] = this.setSetter(this.sequesterSetter, c.getCurrent(c.CARBON_SEQUESTER));
        this.revertValues[this.AUTOMEET] = this.setCheckbox("#checkAutoDemand", a.autoMeetDemand);
        this.revertValues[this.MUSTMEET] = this.setCheckbox("#checkMustDemand", a.mustMeetDemand);
        this.revertValues[this.IGNOREMAX] = !this.setCheckbox("#checkEnforceMax", !a.ignoreMax);
        this.setNetDemand();
    };
    this.updateSequesterRange = function () {
        var a = this.energyControl.carbonModel,
            b = a.getCurrent(a.CARBON_SEQUESTER),
            c = a.getParam(a.CARBON_SEQUESTER_UP),
            d = b - c;
        0 > d && (d = 0);
        var e = b + c,
            f = a.getNewCoalCarbon();
        e > f && ((e = f), d > e && (d = e - 2 * c), 0 > d && (d = 0));
        this.sequesterSetter.minVal = d;
        this.sequesterSetter.maxVal = e;
        c = b;
        e < b && ((c = e), a.setCurrent(a.CARBON_SEQUESTER, e));
        this.sequesterSetter.setValue(c, b);
    };
    this.doOK = function () {
        this.energyControl.updateStatus();
    };
    this.revert = function () {
        var a = this.energyControl,
            b = a.energyModel,
            c = a.carbonModel,
            d = this.revertValues;
        b.setCurrent(b.ENERGY_DEMAND_GROWTH, d[this.DEMAND]);
        this.setSetter(this.demandSetter, d[this.DEMAND]);
        b.setCurrent(b.ENERGY_EFFICIENCY, d[this.EFFICIENCY]);
        this.setSetter(this.efficiencySetter, d[this.EFFICIENCY]);
        c.setCurrent(c.CARBON_SEQUESTER, d[this.SEQUESTER]);
        this.setSetter(this.sequesterSetter, d[this.SEQUESTER]);
        a.autoMeetDemand = d[this.AUTOMEET];
        a.mustMeetDemand = d[this.MUSTMEET];
        a.ignoreMax = d[this.IGNOREMAX];
        this.setCheckbox("#checkAutoDemand", a.autoMeetDemand);
        this.setCheckbox("#checkMustDemand", a.mustMeetDemand);
        this.setCheckbox("#checkEnforceMax", !a.ignoreMax);
        a.updateStatus();
    };
}
var energyParams = {
        demandGrowth: 0.02,
        demandGrowthMax: 0.05,
        efficiency: 0.005,
        efficiencyMax: 0.025,
        energySource: { Oil: 170.4, Coal: 150.6, Gas: 113.8, Nuclear: 10, Biofuel: 53.5, Hydro: 12.4, Solar: 0.3, Wind: 2.9 },
        constrain: { biofuelMax: 500, oilUp: 0.1, oilTurn: 2030, coalUp: 0.4, gasUp: 0.15, gasTurn: 2040, nuclearUp: 0.3, hydroMax: 100, hydroUp: 0.25, solarUp: 0.4, windUp: 0.35, sequesterUp: 1, deforestMax: 50 },
        carbonPlotMin: 275,
        carbonPlotMax: 850,
        carbonPlotGoal: 550,
        startYear: 2010,
        endYear: 2110,
        atmoPPM: 390,
        atmoCarbon: 720,
        surfaceCarbon: 1e3,
        deepCarbon: 38e3,
        plantCarbon: 700,
        soilCarbon: 2e3,
        oilCarbon: 500,
        coalCarbon: 3500,
        showSoilCarbon: 1800,
        deforestGT: 0,
        fossilDeltaPercent: 2.5,
        sequester: 0,
        sequester_up: 1,
        tundraYears: 50,
        tundraMax: 5,
        biopump: 10,
        x1: 4,
        x2: 3,
        x3: 0.25,
    },
    RCP8_5 = [
        [2010, 390],
        [2020, 416],
        [2030, 449],
        [2040, 489],
        [2050, 541],
        [2060, 604],
        [2070, 677],
        [2080, 758],
        [2090, 845],
        [2100, 936],
    ];
function PlotMgr() {
    this.energyControl = void 0;
    this.PLOT_CO2_RCP8_5 = 0;
    this.PLOT_CO2_CO2 = 1;
    this.PLOT_CO2_GOAL = 2;
    this.PLOT_CO2_NOW = 3;
    this.NUM_TRACES_CO2 = 4;
    this.plotTracesCO2 = [];
    this.PLOT_ENERGY_DEMAND = 0;
    this.PLOT_ENERGY_SUPPLY = 1;
    this.PLOT_ENERGY_NOW = 2;
    this.NUM_TRACES_ENERGY = 3;
    this.plotTracesEnergy = [];
    this.plotTracesCreatedFlag = !1;
    this.plotTracePieTotal = 0;
    this.plotTracePie = [
        ["Oil", 156],
        ["Coal", 96],
        ["Gas", 93],
        ["Biofuel", 44],
        ["Hydro", 9],
        ["Nuclear", 28],
        ["Wind", 0.2],
        ["Solar", 0.2],
    ];
    this.pieColors = "#E65757 #70503C #7070E6 #48B148 #67B1D3 #E68C50 #909090 #DBDB34".split(" ");
    this.init = function (a) {
        this.energyControl = a;
        this.initPlot();
    };
    this.debugData = function () {
        console.log("plotTracePie: " + this.plotTracePie);
        console.log("CO2: " + this.plotTracesCO2[this.PLOT_CO2_CO2]);
        console.log("demand: " + this.plotTracesEnergy[this.PLOT_ENERGY_DEMAND]);
        console.log("supply: " + this.plotTracesEnergy[this.PLOT_ENERGY_SUPPLY]);
    };
    this.setEnergyPoint = function (a, b, c) {
        var d = this.energyControl,
            d = (b - d.startYear) / d.timeStep;
        a === this.PLOT_ENERGY_NOW ? (this.plotTracesEnergy[a][0] = [b, c]) : d > this.plotTracesEnergy[a].length - 1 ? this.plotTracesEnergy[a].push([b, c]) : (this.plotTracesEnergy[a][d] = [b, c]);
    };
    this.setCO2Point = function (a, b, c) {
        var d = this.energyControl,
            d = (b - d.startYear) / d.timeStep;
        a === this.PLOT_CO2_NOW ? (this.plotTracesCO2[a][0] = [b, c]) : d > this.plotTracesCO2[a].length - 1 ? this.plotTracesCO2[a].push([b, c]) : (this.plotTracesCO2[a][d] = [b, c]);
    };
    this.sumPie = function () {
        var a = 0;
        $(this.plotTracePie).map(function () {
            a += this[1];
        });
        return (this.plotTracePieTotal = a);
    };
    this.maxY = function (a) {
        for (var b = a[0][1], c = 1; c < a.length; c++) var d = a[c][1], b = d > b ? d : b;
        return b;
    };
    this.roundPlotMax = function (a, b) {
        var c = a;
        return (c = 2e3 < a ? 1e3 * Math.ceil(a / 1e3) : a > b ? 250 * Math.ceil(a / 250) : b);
    };
    this.roundPlotMaxX = function (a) {
        var b = this.plotTracesCO2[this.PLOT_CO2_CO2][this.plotTracesCO2[this.PLOT_CO2_CO2].length - 1][0],
            b = 50 * Math.ceil(b / 50);
        return Math.max(a, b);
    };
    this.replotLight = function () {
        this.CO2Plot && (this.replotCO2({ data: this.plotTracesCO2 }), this.replotEnergy({ data: this.plotTracesEnergy }), this.piePlot.destroy(), this.makePiePlot("plotPie"));
    };
    this.replot = function () {
        this.CO2Plot && (this.replotCO2(), this.replotEnergy(), this.piePlot.destroy(), this.makePiePlot("plotPie"));
    };
    this.legendOptions = function (a) {
        return {
            show: !0,
            renderer: $.jqplot.EnhancedLegendRenderer,
            location: "nw",
            labels: a,
            showSwatches: !0,
            seriesToggle: "fast",
            showLineStyle: !0,
            showMarkerStyle: !0,
            rendererOptions: { seriesToggle: "normal" },
            placement: "inside",
        };
    };
    this.replotCO2 = function () {
        var a = this.energyControl;
        a.carbonModel.getParam(a.carbonModel.CARBON_MIN);
        var b = { lineWidth: 4, shadow: !1, showMarker: !1 },
            c = this.roundPlotMax(this.maxY(this.plotTracesCO2[this.PLOT_CO2_CO2]), 1e3),
            a = this.roundPlotMaxX(a.endYear);
        this.CO2Plot.replot({
            data: this.plotTracesCO2,
            seriesColors: ["#d0cccc", "#666666", "#EF6300", "#000000"],
            series: [b, { lineWidth: 6, shadow: !0, showMarker: !1 }, b, { lineWidth: 0, shadow: !1, showMarker: !0, markerOptions: { style: "diamond", size: 12 } }],
            highlighter: { show: !0, formatString: "%s, %P ppm", tooltipLocation: "nw" },
            resetAxes: ["yaxis"],
            axes: { yaxis: { max: c, min: 250, tickOptions: { formatString: "%d" } }, xaxis: { max: a, tickOptions: { formatString: "%d" } } },
            legend: this.legendOptions(["Projected", "Simulated", "Goal Limit", "Now"]),
        });
    };
    this.replotEnergy = function () {
        var a = this.energyControl,
            b = this.roundPlotMax(this.maxY(this.plotTracesEnergy[this.PLOT_ENERGY_DEMAND]), 2e3),
            a = this.roundPlotMaxX(a.endYear);
        this.energyPlot.replot({
            data: this.plotTracesEnergy,
            seriesColors: ["#99CCFF", "#0000FF", "#000000"],
            series: [
                { lineWidth: 4, shadow: !1, showMarker: !1 },
                { lineWidth: 6, shadow: !0, showMarker: !1 },
                { lineWidth: 0, shadow: !1, showMarker: !0, markerOptions: { style: "diamond", size: 12 } },
            ],
            highlighter: { show: !0, formatString: "%s, %P EJ", tooltipLocation: "nw" },
            resetAxes: ["yaxis"],
            axes: { yaxis: { max: b, min: 250, tickOptions: { formatString: "%d" } }, xaxis: { max: a, tickOptions: { formatString: "%d" } } },
            legend: this.legendOptions(["Demand", "Supply", "Now"]),
        });
    };
    this.initPlotTraces = function () {
        this.initPlotTracesCO2();
        this.initPlotTracesEnergy();
        this.initPlotTracesPie();
        this.plotTracesCreatedFlag = !0;
    };
    this.initPlotTracesPie = function () {
        for (var a = this.energyControl.energyModel, b = [0, 1, 2, 3, 5, 4, 7, 6], c = 0; c < a.NUM_SOURCES; c++) this.plotTracePie[c][1] = a.currentVals[b[c]];
    };
    this.initPlotTracesCO2 = function () {
        var a = this.energyControl;
        this.plotTracesCO2 = [];
        for (var b = 0; b < this.NUM_TRACES_CO2; b++) this.plotTracesCO2[b] = [];
        for (b = 0; b < RCP8_5.length; b++) this.plotTracesCO2[this.PLOT_CO2_RCP8_5].push(RCP8_5[b]);
        var b = a.carbonModel.getParam(a.carbonModel.CARBON_PPM),
            c = a.paramControl.getParam("carbonPlotGoal");
        this.plotTracesCO2[this.PLOT_CO2_CO2].push([a.thisYear, b]);
        this.plotTracesCO2[this.PLOT_CO2_GOAL].push([a.startYear, c]);
        this.plotTracesCO2[this.PLOT_CO2_GOAL].push([a.endYear, c]);
        this.plotTracesCO2[this.PLOT_CO2_NOW].push([a.thisYear, b]);
    };
    this.initPlotTracesEnergy = function () {
        var a = this.energyControl,
            b = a.energyModel;
        this.plotTracesEnergy = [];
        for (var c = 0; c < this.NUM_TRACES_ENERGY; c++) this.plotTracesEnergy[c] = [];
        var c = b.getEnergySum(),
            d = Math.round(c),
            e = a.thisYear;
        this.plotTracesEnergy[this.PLOT_ENERGY_SUPPLY].push([e, d]);
        this.plotTracesEnergy[this.PLOT_ENERGY_NOW].push([e, d]);
        for (e = a.startYear; e <= a.endYear; e += a.timeStep) this.plotTracesEnergy[this.PLOT_ENERGY_DEMAND].push([e, Math.round(c)]), (c = b.getNextDemand(c, a.stepYears));
    };
    this.makeYearTicks = function () {
        for (var a = this.energyControl, b = [], c = a.startYear; c <= a.endYear; c += 2 * a.timeStep) b.push(c);
        return b;
    };
    this.initPlot = function () {
        var a = this.energyControl;
        this.plotTracesCreatedFlag || this.initPlotTraces();
        var b = this.makeYearTicks();
        this.energyPlot && (this.energyPlot.destroy(), this.piePlot.destroy(), this.CO2Plot.destroy());
        this.energyPlot = $.jqplot(
            "plotEnergy",
            [
                [
                    [a.startYear, 420],
                    [2100, 1870],
                ],
            ],
            {
                title: { text: "World Energy Per Year (EJ)", textAlign: "right" },
                axesDefaults: { labelRenderer: $.jqplot.CanvasAxisLabelRenderer },
                axes: { xaxis: { min: a.startYear, max: a.endYear, pad: 0, ticks: b }, yaxis: { pad: 20, min: 250, max: 2e3 } },
            }
        );
        this.piePlot = this.makePiePlot("plotPie");
        var c = a.carbonModel.getParam(a.carbonModel.CARBON_MIN);
        this.CO2Plot = $.jqplot(
            "plotCO2",
            [
                [
                    [a.startYear, 280],
                    [2100, 390],
                ],
            ],
            {
                title: { text: "Atmospheric CO<sub>2</sub> (ppm)", textAlign: "right" },
                axesDefaults: { labelRenderer: $.jqplot.CanvasAxisLabelRenderer },
                axes: { xaxis: { min: a.startYear, max: a.endYear, pad: 0, ticks: b }, yaxis: { pad: 20, min: c, max: 1e3 } },
            }
        );
        this.replot();
    };
    this.makePiePlot = function (a) {
        function b(a, b) {
            var c = Math.floor(a);
            return 5 > a && a > c ? a.toFixed(b) : Math.round(a);
        }
        function c(a, c, g, k) {
            a = $("#plotPie .jqplot-highlighter-tooltip");
            c = (e[g][1] / d) * 100;
            g = e[g][0] + " " + b(e[g][1], 1) + " EJ (" + b(c, 0) + "%)";
            a.html(g);
            return g;
        }
        var d = this.sumPie();
        this.initPlotTracesPie();
        var e = this.plotTracePie;
        a = jQuery.jqplot(a, [e], {
            seriesColors: this.pieColors,
            seriesDefaults: { shadow: !1, renderer: jQuery.jqplot.PieRenderer, rendererOptions: { padding: 0, startAngle: 270, sliceMargin: 0, showDataLabels: !1 } },
            highlighter: { show: !0, tooltipLocation: "nw", useAxesFormatters: !1, tooltipContentEditor: c },
            legend: { show: !0, rendererOptions: { numberRows: 2 }, location: "s" },
        });
        $("#plotPie .jqplot-event-canvas").click(function (a) {
            var b = $("#plotPie .jqplot-highlighter-tooltip"),
                d = $("#plotPie .jqplot-table-legend"),
                k = d.parent().offset(),
                m = d.offset(),
                l = d.width(),
                n = d.height(),
                q = a.pageX - m.left,
                p = a.pageY - m.top;
            0 < q && 0 < p && q < l && p < n && ((d = 0), p > n / 2 && (d = 4), (n = Math.floor(q / (l / 4))), (d += n), c(a, 0, d, e), b.css("left", m.left - k.left + 0.68 * l), b.css("top", m.top - k.top - 30), b.show());
        });
        return a;
    };
}
function EnergyControl() {
    this.paramControl = new ParamControl();
    this.energyModel = new EnergyModel();
    this.carbonModel = new CarbonModel();
    this.plotMgr = new PlotMgr();
    this.energyPopup = new AdjustEnergySources();
    this.advancedPopup = new AdvancedOptions();
    this.startYear = this.thisYear = 2010;
    this.endYear = 2110;
    this.timeStep = 10;
    this.autoMeetDemand = !1;
    this.mustMeetDemand = !0;
    this.livePlotUpdateDefault = this.livePlotUpdate = this.ignoreMax = !1;
    this.STATUS_GOOD = "ready";
    this.STATUS_WARN = "warn";
    this.STATUS_STOP = "notReady";
    this.STATUS_HAPPY = "happy";
    this.STATUS_UNHAPPY = "unhappy";
    this.init = function () {
        var a = this;
        this.setScenario(energyParams);
        this.initModels();
        this.initLayout();
        this.plotMgr.init(this);
        this.initDialogs();
        this.initWidgets();
        this.projectDecade();
        this.updateStatus();
        setTimeout(function () {
            a.updateDisplay();
        }, 500);
        this.resize();
    };
    this.reinit = function () {
        this.thisYear = parseInt(this.params.startYear);
        this.autoMeetDemand = 1 == $("#lessonSelect").val();
        this.mustMeetDemand = !0;
        this.ignoreMax = !1;
        this.livePlotUpdate = this.livePlotUpdateDefault;
        this.initModels();
        this.plotMgr.initPlotTraces();
        this.advancedPopup.reinit();
        this.projectDecade();
        this.updateStatus();
    };
    this.stepDecade = function () {
        var a = this.carbonModel,
            b = this.energyModel,
            c = this.plotMgr;
        a.stepDecade();
        a = a.getCurrent(a.CARBON_PPM);
        this.thisYear += this.timeStep;
        c.setCO2Point(c.PLOT_CO2_CO2, this.thisYear, a);
        c.setCO2Point(c.PLOT_CO2_NOW, this.thisYear, a);
        b = b.getEnergySum();
        c.setEnergyPoint(c.PLOT_ENERGY_SUPPLY, this.thisYear, b);
        this.projectDecade();
        this.advancedPopup.onStep();
        this.updateStatus();
        this.updateDisplay();
    };
    this.setStatus = function (a, b) {
        $(".messages." + a + " .message").html(b);
        $(".messages." + a).show();
    };
    this.clearStatus = function () {
        $(".messages.notReady, .messages.ready, .messages.happy, .messages.unhappy, .messages.warn").hide();
    };
    this.updateStatus = function () {
        var a = this.plotMgr;
        this.clearStatus();
        var b = this.STATUS_NO_COMMENT,
            c = this.isCarbonBad();
        c && (b = "CO2 levels are above goal.");
        var d = !1;
        this.thisYear === this.endYear
            ? (c
                  ? ((d = !0), this.setStatus(this.STATUS_STOP, "Year " + this.endYear + ", simulation ends."), this.setStatus(this.STATUS_UNHAPPY, b))
                  : (this.setStatus(this.STATUS_GOOD, "Year " + this.endYear + ", simulation ends."), this.setStatus(this.STATUS_HAPPY, "YAY! Met carbon goal!")),
              a.setEnergyPoint(a.PLOT_ENERGY_NOW, this.thisYear, this.getCurrentDemand()))
            : ((a = this.getUnmetDemand()),
              0 < a ? ((a = "Need another " + a + " EJ energy."), this.mustMeetDemand ? (this.setStatus(this.STATUS_STOP, a), (d = !0)) : this.setStatus(this.STATUS_WARN, a)) : this.setStatus(this.STATUS_GOOD, "Demand met! Ready to step."),
              c && this.setStatus(this.STATUS_UNHAPPY, b));
        d
            ? ($(".ready").hide(), $(".notReady").show(), $("#supplyButton").addClass("blue"), $("#addEnergyLabel").html("Add Energy"))
            : ($(".notReady").hide(), $(".ready").show(), $("#supplyButton").removeClass("blue"), $("#addEnergyLabel").html("Adjust Energy Sources"));
        $("#currentYear").html(this.thisYear);
        b = this.energyModel.getEnergySum();
        $("#supplyThisYear").html(Math.round(b));
        b = this.energyModel.getNextDemand(this.getCurrentDemand());
        $("#demandThisYear").html(Math.round(b));
        this.updateTraces();
    };
    this.updateTraces = function () {
        if (this.thisYear !== this.endYear) {
            var a = this.carbonModel,
                b = this.energyModel,
                c = this.plotMgr,
                d = Math.round(b.getEnergySum());
            c.setEnergyPoint(c.PLOT_ENERGY_SUPPLY, this.thisYear + this.timeStep, d);
            a = Math.round(a.projectDecade());
            c.setCO2Point(c.PLOT_CO2_CO2, this.thisYear + this.timeStep, a);
            a = this.getCurrentDemand();
            c.setEnergyPoint(c.PLOT_ENERGY_NOW, this.thisYear, a);
            for (year = this.thisYear + this.timeStep; year <= this.endYear; year += this.timeStep) (a = Math.round(b.getNextDemand(a))), c.setEnergyPoint(c.PLOT_ENERGY_DEMAND, year, a);
            c.replotLight();
        }
    };
    this.yearToIndex = function (a) {
        return (a - this.startYear) / this.timeStep;
    };
    this.getNextYear = function () {
        var a = this.thisYear + this.timeStep;
        a > this.endYear && (a = this.endYear);
        return a;
    };
    this.getUnmetDemand = function () {
        return this.energyPopup.checkShortFall();
    };
    this.getNextDemand = function () {
        var a = this.plotMgr,
            b = this.thisYear;
        b < this.endYear && (b += this.timeStep);
        b = this.yearToIndex(b);
        return a.plotTracesEnergy[a.PLOT_ENERGY_DEMAND][b][1];
    };
    this.getCurrentDemand = function () {
        var a = this.plotMgr;
        return a.plotTracesEnergy[a.PLOT_ENERGY_DEMAND][(this.thisYear - this.startYear) / this.timeStep][1];
    };
    this.isCarbonBad = function () {
        var a = this.carbonModel,
            b = a.getParam(a.CARBON_GOAL);
        return a.getCurrent(a.CARBON_PPM) > b;
    };
    this.initModels = function () {
        var a = this.params,
            b = this.energyModel,
            c = this.carbonModel;
        c.carbonControl = this;
        this.paramNameMap = {
            carbonPlotMin: c.CARBON_MIN,
            carbonPlotMax: c.CARBON_MAX,
            carbonPlotGoal: c.CARBON_GOAL,
            startYear: c.CARBON_START_YEAR,
            endYear: c.CARBON_END_YEAR,
            atmoPPM: c.CARBON_PPM,
            atmoCarbon: c.CARBON_ATM,
            surfaceCarbon: c.CARBON_OCEAN_SURFACE,
            deepCarbon: c.CARBON_OCEAN_DEEP,
            plantCarbon: c.CARBON_TERRESTRIAL,
            soilCarbon: c.CARBON_SOILS,
            oilCarbon: c.CARBON_OILGAS,
            coalCarbon: c.CARBON_COAL,
            biopump: c.CARBON_BIOPUMP,
            x1: c.CARBON_X1,
            x2: c.CARBON_X2,
            x3: c.CARBON_X3,
            tundraYears: c.CARBON_TUNDRA_YEARS,
            tundraMax: c.CARBON_TUNDRA_MAX,
            sequester: c.CARBON_SEQUESTER,
            sequester_up: c.CARBON_SEQUESTER_UP,
            deforestGT: c.CARBON_DEFORESTATION,
        };
        this.thisYear = this.startYear = parseInt(a.startYear);
        this.endYear = parseInt(a.endYear);
        b.setParam(b.OIL, parseFloat(a.energySource.Oil));
        b.setParam(b.COAL, parseFloat(a.energySource.Coal));
        b.setParam(b.GAS, parseFloat(a.energySource.Gas));
        b.setParam(b.NUCLEAR, parseFloat(a.energySource.Nuclear));
        b.setParam(b.BIOFUEL, parseFloat(a.energySource.Biofuel));
        b.setParam(b.HYDRO, parseFloat(a.energySource.Hydro));
        b.setParam(b.SOLAR, parseFloat(a.energySource.Solar));
        b.setParam(b.WIND, parseFloat(a.energySource.Wind));
        b.setParam(b.ENERGY_DEMAND_GROWTH, parseFloat(a.demandGrowth));
        b.setParam(b.ENERGY_DEMAND_GROWTH_MAX, parseFloat(a.demandGrowthMax));
        b.setParam(b.ENERGY_EFFICIENCY, parseFloat(a.efficiency));
        b.setParam(b.ENERGY_EFFICIENCY_MAX, parseFloat(a.efficiencyMax));
        var d = $("#lessonSelect").val();
        b.efficiencyFlag = 0 < d;
        b.init();
        c.preinit();
        for (var e in this.paramNameMap) c.setParam(this.paramNameMap[e], parseFloat(a[e]));
        c.setParam(c.CARBON_DEFOREST_MAX, 0);
        c.init();
    };
    this.projectDecade = function () {
        var a = this.energyModel,
            b = this.carbonModel,
            c = this.plotMgr;
        this.energyPopup.setLastValues();
        if (!(this.thisYear >= this.endYear)) {
            this.yearToIndex(this.thisYear);
            this.autoMeetDemand && a.autoMeetDemand(this.timeStep);
            Math.round(a.getEnergySum());
            var d = Math.round(a.getNextDemand(this.getCurrentDemand())),
                a = this.thisYear + this.timeStep;
            c.setEnergyPoint(c.PLOT_ENERGY_DEMAND, a, d);
            c.setEnergyPoint(c.PLOT_ENERGY_SUPPLY, a, d);
            b = Math.round(b.projectDecade());
            c.setCO2Point(c.PLOT_CO2_CO2, a, b);
            this.energyPopup.runCheckers();
            this.autoMeetDemand && this.energyPopup.reportAutoMet();
        }
    };
    this.addScenario = function (a) {
        this.paramControl.addScenario(a);
    };
    this.setScenario = function (a) {
        this.paramControl.setScenario(a);
        this.params = a;
    };
    this.setParams = function (a) {
        this.paramControl.setParams(a);
    };
    this.revert = function () {
        this.setScenario(this.paramControl.currentScenario);
        this.reinit();
        this.updateDisplay();
    };
    this.updateDisplay = function () {
        this.plotMgr.replot();
    };
    this.layoutScreen = function () {
        var a = $(window).height();
        $(window).width();
        $(".rightSide").width();
        var b = $(".rightSide").height();
        Math.max(b, 480);
        b = $(".rightSide").offset().top;
        portraitFlag = !1;
        b > (2 * a) / 3 && (portraitFlag = !0);
        500 > $(".leftSide").width() ? $("#supplyButton, #optionsButton").addClass("stacked") : $("#supplyButton, #optionsButton").removeClass("stacked");
        b = $("#runControls").offset().top;
        plotH = (a - 10 - b) / 2 - 10;
        plotW = $(".rightSide").width();
        plotMinH = 280;
        plotH = Math.max(plotH, plotMinH);
        portraitFlag && (plotW -= 10);
        $("#plotCO2").height(plotH).width(plotW);
        $("#plotEnergy").height(plotH).width(plotW);
        plotW = $(".leftSide").width();
        b = $("#plotPie").offset().top;
        plotH = a - b - 10;
        plotH = Math.max(plotH, plotMinH);
        $("#plotPie").width(plotW).height(plotH);
    };
    this.initLayout = function () {
        var a = this;
        $(window).resize(function () {
            a.layoutScreen();
            a.layoutScreen();
            a.updateDisplay();
        });
        this.resize();
    };
    this.resize = function () {
        $(window).trigger("resize");
    };
    this.showEnergyPopup = function (a) {
        var b = this;
        a
            ? ($("#adjustEnergyPanel").dialog("open"),
              b.energyPopup.onShow(),
              $("#textOil").blur(),
              $('.ui-dialog[aria-describedby="adjustEnergyPanel"] .ui-dialog-titlebar-close').bind("click", function (a) {
                  b.energyPopup.revert();
              }))
            : $("#adjustEnergyPanel").dialog("close");
    };
    this.initRangesliders = function () {
        $('input[type="range"]').rangeslider({ polyfill: !1 });
        $(".rangeslider .rangeslider__fill").after('<div class="lastValMarker" title="Value last decade"></div>');
    };
    this.initWidgets = function () {
        var a = this,
            b = this.energyModel;
        this.initRangesliders();
        this.advancedPopup.init(this);
        $("#supplyButton").bind("click", function (b) {
            a.showEnergyPopup(!0);
        });
        $("#optionsButton").bind("click", function (b) {
            a.advancedPopup.onShow();
            $("#advancedOptionsPanel").dialog("open");
            $("#textDemandChange").blur();
        });
        $("#rewindButton").bind("click", function (b) {
            a.reinit();
        });
        $("#stepButton").bind("click", function (b) {
            a.stepDecade();
        });
        $("#lessonSelect").val(0);
        $("#lessonSelect").selectmenu({ width: "13em" });
        $("#lessonSelect").on("selectmenuchange", function (c) {
            "0" === $("#lessonSelect").val() ? ($("#optionsButton").hide(), (a.autoMeetDemand = !1), (b.efficiencyFlag = !1)) : ($("#optionsButton").show(), (a.autoMeetDemand = !0), (b.efficiencyFlag = !0));
            a.layoutScreen();
            a.revert();
        });
        $("#livePlotUpdateCB").click(function () {
            a.livePlotUpdate = this.checked;
        });
    };
    this.initDialogs = function () {
        var a = this;
        $(window).width();
        this.energyPopup.init(this);
        $("#adjustEnergyPanel").dialog({ autoOpen: !1, modal: !1, width: 450, closeOnEscape: !0, position: { my: "left top", at: "center top", of: $("#adjustButtons") } });
        $("#adjustEnergyPanel .cancelButton").bind("click", function (b) {
            $("#adjustEnergyPanel").dialog("close");
            a.energyPopup.revert();
        });
        $("#adjustEnergyPanel .OKButton").bind("click", function (b) {
            $("#adjustEnergyPanel").dialog("close");
            a.energyPopup.doOK();
        });
        $("#advancedOptionsPanel").dialog({ autoOpen: !1, modal: !1, width: 450, closeOnEscape: !0, position: { my: "left top", at: "left top", of: $("#adjustButtons") } });
        $("#advancedOptionsPanel .cancelButton").bind("click", function (b) {
            $("#advancedOptionsPanel").dialog("close");
            a.advancedPopup.revert();
        });
        $("#advancedOptionsPanel .OKButton").bind("click", function (b) {
            $("#advancedOptionsPanel").dialog("close");
            a.updateStatus();
        });
    };
}
function getParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    a = new RegExp("[\\?&]" + a + "=([^&#]*)").exec(location.search);
    return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "));
}
$(document).ready(function () {
    new EnergyControl().init();
    (initLesson = window.getParameterByName("initLesson")) && $("#lessonSelect").val(initLesson).selectmenu("refresh").trigger("selectmenuchange");
});
