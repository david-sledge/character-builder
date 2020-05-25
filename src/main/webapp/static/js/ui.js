//var debug = false;

function _(tagName, attrs, children) {
    return $("<" + tagName + ">", attrs).append(children);
}

function tx(string, attrs) {
    return _("div", attrs, document.createTextNode(string)).css({"display":"inline-block"});
}

function parseSignedInt(string) {
    return parseInt(string.trim().split("\u2212").join("-"));
}

function createTextField(props) {
    var attrs = {};

    if (props != undefined && props != null) {
        Object.assign(attrs, props);
    }

    Object.assign(attrs, {"type":"text"});

    return _("input", attrs);
}

function createModifierField() {

    var field = createTextField({"maxlength":3}).css({"text-align": "center", "width":"2em"}).numeric(
        false,
        function () {
            alert('Integers only');
            this.value = '';
            this.focus();
        }
    );

    return field.focus(function() {

        var text = field.val();

        if (text.length > 1) {
            if (text.charAt(0) == "\u2212") {

                field.val("-" + text.substr(1));

            }
            else if (text.charAt(0) == "+") {

                field.val(text.substr(1));

            }

        }

    }).blur(function() {

        field.val(formatNonZeroNumber(field.val()));

    });

}

function createNonNegIntField() {

    return createTextField({"maxlength":3})
        .css({"text-align": "right", "width": "2em"})
        .numeric(
            {decimal: false, negative: false},
            function () {
                alert('No negative values');
                this.value = '';
                this.focus();
            }
        );

}

function createAbilityScoreField() {

    return createNonNegIntField().val(8);

}

function createWholeNumberField() {

    var field = createNonNegIntField();

    return field.blur(function() {

        if (field.val() == "0") {
            field.val("");
        }

    })

}

function createNaturalNumberField() {

    var field = createWholeNumberField();

    return field.keypress(function(e) {

        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

        if (field.prop("selectionStart") === 0 && key == 48) {
            return false;
        }

    })

}

function createWholeNumberDisplay() {

    return tx("").css({"text-align": "right", "width": "100%", "min-width": "2em"});

}

function createTextArea(props) {
    var attrs = {};

    if (props != undefined && props != null) {
        Object.assign(attrs, props);
    }

    return _("textarea", attrs);
}

function createDatePicker() {
    return createTextField().datepicker();
}

function createTableHeader(attrs, children) {
    return _("th", attrs, children).css("vertical-align", "bottom");
}

function createMultiField(fields) {

    var container = _('div', {}, fields).css({"display":"inline-block"});
    var activeNdx = 0;

    for (var ndx = 1; ndx < fields.length; ndx++) {
        fields[ndx].hide();
    }

    container.setActiveField = function(ndx) {

        fields[activeNdx].hide();
        activeNdx = ndx;
        fields[activeNdx].show();

    };

    var changeListener;

    container.change = function(f) {

        if (f == undefined) {

            if (typeof changeListener === "function") {
                changeListener();
            }

        }
        else {
            changeListener = f;
        }

    };

    container.val = function() {

        return fields[activeNdx].val ? fields[activeNdx].val() : "";

    };

    container.getActiveIndex = function() {
        return activeNdx;
    }

    return container;
}

function formatNumber(value) {

    if (!isNaN(value) && value > 0) {
        return "" + value;
    }

    return "";

}

function formatWholeNumber(value) {

    if (isNaN(value)) {
        return "\u2014";
    }

    return "" + value;

}

function formatNonZeroNumber(value) {

    if (!isNaN(value)) {
        if (value < 0) {
            return "\u2212" + (-value);
        }
        if (value > 0) {
            return "+" + value;
        }
    }

    return "";

}

function formatSignedIntegerNumber(value) {

    if (!isNaN(value)) {
        if (value < 0) {
            return "\u2212" + (-value);
        }
        if (value >= 0) {
            return "+" + value;
        }
    }

    return "";

}

//------------------------------------------------------------------------------

var abilityNames = ["str", "dex", "con", "int", "wis", "cha"];

function nameLoop(f) {

    for (var ndx = 0; ndx < abilityNames.length; ndx++) {

        var name = abilityNames[ndx];
        f(name);

    }

}

//*
var saveBonusCalcFuncs = {
  "poor" : function (level) {
    return Math.floor(level / 3);
  },
  "fair" : function (level) {
    return Math.floor((3 + level) * 2 / 5);
  },
  "good" : function (level) {
    return 2 + Math.floor(level / 2);
  }
};

var bonusTypeCalcFuncs = {
  "bab" : {
    "poor" : function (level) {
      return Math.floor(level / 2);
    },
    "fair" : function (level) {
      return Math.floor(3 * level / 4);
    },
    "good" : function (level) {
      return level;
    }
  },
  "fort" : saveBonusCalcFuncs,
  "will" : saveBonusCalcFuncs,
  "ref" : saveBonusCalcFuncs,
  "def" : {
    "none" : function (level) {
      return 0;
    },
    "poor" : function (level) {
      return Math.floor((1 + level) / 3);
    },
    "fairA" : function (level) {
      return Math.floor((1 + level) / 2);
    },
    "fairB" : function (level) {
      return Math.floor((7 + 2 * level) / 5);
    },
    "good" : function (level) {
      return Math.floor((5 + 4 * level) / 6);
    },
    "superior" : function (level) {
      return Math.floor((6 + level) / 2);
    }
  },
  "rep" : {
    "none" : function (level) {
      return 0;
    },
    "poor" : function (level) {
      return Math.floor(level * 2 / 9);
    },
    "fair" : function (level) {
      return Math.floor(level / 3);
    },
    "good" : function (level) {
      return Math.floor((2 + level) / 3);
    },
    "superior" : function (level) {
      return Math.floor((5 + level) / 3);
    }
  }
};
// */

var skills = {
    "0": "Balance",
    "1": "Bluff",
    "2": "Climb",
    "3": "Computer Use",
    "4": "Concentration",
    "5": "Craft (chemical)",
    "6": "Craft (electronic)",
    "7": "Craft (mechanical)",
    "8": "Craft (pharmaceutical)",
    "9": "Craft (structural)",
    "10": "Craft (visual art)",
    "11": "Craft (writing)",
    "12": "Decipher Script",
    "13": "Demolitions",
    "14": "Diplomacy",
    "15": "Disable Device",
    "16": "Disguise",
    "17": "Drive",
    "18": "Escape Artist",
    "19": "Forgery",
    "20": "Gamble",
    "21": "Gather Information",
    "22": "Handle Animal",
    "23": "Hide",
    "24": "Intimidate",
    "25": "Investigate",
    "26": "Jump",
    "27": "Knowledge (arcane lore)",
    "28": "Knowledge (art)",
    "29": "Knowledge (behavior sciences)",
    "30": "Knowledge (business)",
    "31": "Knowledge (civics)",
    "32": "Knowledge (current events)",
    "33": "Knowledge (earth and life sciences)",
    "34": "Knowledge (history)",
    "35": "Knowledge (physical sciences)",
    "36": "Knowledge (popular culture)",
    "37": "Knowledge (streetwise)",
    "38": "Knowledge (tactics)",
    "39": "Knowledge (technology)",
    "40": "Knowledge (theology and philosophy)",
    "41": "Listen",
    "42": "Move Silently",
    "43": "Navigate",
    "44": "Perform (act)",
    "45": "Perform (dance)",
    "46": "Perform (keyboards)",
    "47": "Perform (percussion instruments)",
    "48": "Perform (sing)",
    "49": "Perform (stand-up)",
    "50": "Perform (stringed instruments)",
    "51": "Perform (wind instruments)",
    "52": "Pilot",
    "53": "Profession",
    "54": "Read/Write Language",
    "55": "Repair",
    "56": "Research",
    "57": "Ride",
    "58": "Search",
    "59": "Sense Motive",
    "60": "Sleight of Hand",
    "61": "Speak Language",
    "62": "Spot",
    "63": "Survival",
    "64": "Swim",
    "65": "Treat Injury",
    "66": "Tumble"
};

var classes = {
    "0": {
        "name": "Strong hero",
        "bab": bonusTypeCalcFuncs["bab"]["good"],
        "fort": bonusTypeCalcFuncs["fort"]["fair"],
        "ref": bonusTypeCalcFuncs["ref"]["poor"],
        "will": bonusTypeCalcFuncs["will"]["poor"],
        "def": bonusTypeCalcFuncs["def"]["fairB"],
        "rep": bonusTypeCalcFuncs["rep"]["poor"],
        "skill": 2,
        "skills": [
            "2",
            "9",
            "22",
            "26",
            "32",
            "36",
            "37",
            "38",
            "53",
            "54",
            "55",
            "61",
            "64"
        ]
    }
};

function createRowFields() {

    var source = null;
    var destination = null;

    var changeHandlers = {};
    var accessors = {};

    // editable fields -----------------------------------------------------
    var deleteUi = _("button", {});
    var classSelectUi = _("select", {}, [
        _("option", {"value":""}, [document.createTextNode("-- non-class adjustments --")]),
        _("option", {"value":"0"}, [document.createTextNode("Strong hero")])
    ]);
    var classUi = createMultiField([classSelectUi, tx("")]);
    classSelectUi.change(function() {classUi.change();});
    var laChangeTextUi = createModifierField();
    var laChangeUi = createMultiField([laChangeTextUi,tx("")]);
    laChangeTextUi.change(function() {laChangeUi.change();});
    var charAdjustUi = createTextArea().css({"vertical-align": "top"});
    var abilities = {
        "str": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getStr"];},
            "inListener" : null,
            "changeName" : "strChange",
            "change" : null,
            "getName": "getStr"
        },
        "dex": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getDex"];},
            "inListener" : null,
            "changeName" : "dexChange",
            "change" : null,
            "getName": "getDex"
        },
        "con": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getCon"];},
            "inListener" : function() {
                changeHandlers["hpChange"]();
            },
            "changeName" : "conChange",
            "change" : null,
            "getName": "getCon"
        },
        "int": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getInt"];},
            "inListener" : function() {
                changeHandlers["skillPointsChange"]();
            },
            "changeName" : "intChange",
            "change" : null,
            "getName": "getInt"
        },
        "wis": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getWis"];},
            "inListener" : null,
            "changeName" : "wisChange",
            "change" : null,
            "getName": "getWis"
        },
        "cha": {
            "field": createModifierField(),
            "display": createWholeNumberDisplay(),
            "srcMethod": function() {return source["accessors"]["getCha"];},
            "inListener" : null,
            "changeName" : "chaChange",
            "change" : null,
            "getName": "getCha"
        }
    };
    var hpRollTextUi = createNaturalNumberField();
    var hpRollUi = createMultiField([tx(""),hpRollTextUi]);
    hpRollTextUi.change(function() {hpRollUi.change();});
    var featsUi = createTextArea();
    var specialAbilitiesUi = createTextArea();
    var bonusSkillPointsTextUi = createWholeNumberField();
    var bonusSkillPointsUi = createMultiField([bonusSkillPointsTextUi,tx("")]);
    bonusSkillPointsTextUi.change(function() {bonusSkillPointsUi.change();});

    // display-only fields -------------------------------------------------
    var classLevelDisplay = createWholeNumberDisplay();
    var characterLevelDisplay = createWholeNumberDisplay();
    var totalLevelAdjustmentDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var eclDisplay = createWholeNumberDisplay();
    var hpTotalDisplay = createWholeNumberDisplay();
    var babDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var fortDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var refDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var willDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var defDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var repDisplay = tx("").css({"text-align": "center", "min-width": "2em"});
    var totalSkillPointsDisplay = createWholeNumberDisplay();
    var unspentSkillPointsDisplay = createWholeNumberDisplay();

    var $rowUi = _("tr", {}, [
        // Delete
        _("td", {}, deleteUi).css({"vertical-align": "top"}),
        // Class/HD
        _("td", {}, classUi).css({"vertical-align": "top"}),
        // Class/HD level
        _("td", {}, classLevelDisplay).css({"vertical-align": "top"}),
        // Character level
        _("td", {}, characterLevelDisplay).css({"vertical-align": "top"}),
        // Total level adjustment
        _("td", {}, totalLevelAdjustmentDisplay).css({"vertical-align": "top"}),
        // Change in level adjustment
        _("td", {}, laChangeUi).css({"vertical-align": "top"}),
        // Effective character level
        _("td", {}, eclDisplay).css({"vertical-align": "top"}),
        // Character adjustments
        _("td", {}, charAdjustUi).css({"vertical-align": "top"})
    ]);

    nameLoop(function(name) {

        var ability = abilities[name];

        $rowUi.append(
            // ability score
            _("td", {}, [ability["display"]]).css({"vertical-align": "top"}),
            // increase or decrease
            _("td", {}, [ability["field"]]).css({"vertical-align": "top"})
        );

    });

    $rowUi.append(
        // Hit point roll
        _("td", {}, hpRollUi).css({"vertical-align": "top"}),
        // Hit point total
        _("td", {}, hpTotalDisplay).css({"vertical-align": "top"}),
        // Feats
        _("td", {}, featsUi).css({"vertical-align": "top"}),
        // Special Abilities
        _("td", {}, specialAbilitiesUi).css({"vertical-align": "top"}),
        // Base attack bonus
        _("td", {}, babDisplay).css({"vertical-align": "top"}),
        // Base Fort save bonus
        _("td", {}, fortDisplay).css({"vertical-align": "top"}),
        // Base Ref save bonus
        _("td", {}, refDisplay).css({"vertical-align": "top"}),
        // Base Will save bonus
        _("td", {}, willDisplay).css({"vertical-align": "top"}),
        // Def bonus
        _("td", {}, defDisplay).css({"vertical-align": "top"}),
        // Rep bonus
        _("td", {}, repDisplay).css({"vertical-align": "top"}),
        // Bonus skill points
        _("td", {}, bonusSkillPointsUi).css({"vertical-align": "top"}),
        // Cumulative total skill points
        _("td", {}, totalSkillPointsDisplay).css({"vertical-align": "top"}),
        // Unspent skill points
        _("td", {}, unspentSkillPointsDisplay).css({"vertical-align": "top"})
    ).prop({

        "changeHandlers": changeHandlers,
        "accessors": accessors

    });
    var rowUi = $rowUi[0];

    // data accessors ------------------------------------------------------
    accessors["getClassAndCharacterLevel"] = function() {

        var classCode = classUi.val();
        var levels = source["accessors"]["getClassAndCharacterLevel"]();

        if (levels == null) {

            levels = {
                "classLevels": {},
                "characterLevel": 0,
                "firstClass": null
            };

        }

        if (classCode === "") {

            return levels;

        }

        var classLevels = levels["classLevels"];

        if (classLevels[classCode]) {

            classLevels[classCode]++;

        }
        else {

            classLevels[classCode] = 1;

        }

        // update character level
        var characterLevel = 0;
        var firstClass = levels["firstClass"];

        for (var name in classLevels) {

            characterLevel += classLevels[name];

            if (firstClass == null) {

                firstClass = name;

            }

        }

        return {

            "classLevels": classLevels,
            "characterLevel": characterLevel,
            "firstClass": firstClass

        };

    };

    accessors["getTotalLevelAdjustment"] = function() {

        var change = parseSignedInt(laChangeUi.val());

        return source["accessors"]["getTotalLevelAdjustment"]() + (isNaN(change) ? 0 : change);

    };

    function getEcl() {
        // TODO
    }

    nameLoop(function(name) {

        var ability = abilities[name];

        accessors[ability["getName"]] = function () {
            var change = parseSignedInt(ability["field"].val());

            return ability["srcMethod"]()() + (isNaN(change) ? 0 : change);
        };

    });

    accessors["getHpTotal"] = function() {

        var activeNdx = hpRollUi.getActiveIndex();

        if (activeNdx == 0) {

            return source["accessors"]["getHpTotal"]();

        }
        else {

            var hpRoll = parseInt(hpRollUi.val());

            if (isNaN(hpRoll)) {
                return hpRoll;
            }

            var hp = hpRoll +
                Math.floor(accessors["getCon"]() / 2) - 5;

            if (hp < 1) {

                hp = 1;

            }

            return source["accessors"]["getHpTotal"]() + hp;

        }

    };

    function getBab() {
        // TODO
    }

    function getFort() {
        // TODO
    }

    function getRef() {
        // TODO
    }

    function getWill() {
        // TODO
    }

    function getDef() {
        // TODO
    }

    function getRep() {
        // TODO
    }

    accessors["getBonusSkillPoints"] = function() {

        var bonusSkillPoints = parseInt(bonusSkillPointsUi.val());

        return source["accessors"]["getBonusSkillPoints"]() +
            (isNaN(bonusSkillPoints) ? 0 : bonusSkillPoints);

    }

    accessors["getTotalSkillPoints"] = function() {

        var classAndCharacterLevel = accessors["getClassAndCharacterLevel"]();
        var firstClass = classAndCharacterLevel["firstClass"];

        if (firstClass == null) {
            return 0;
        }

        var intMod = Math.floor(accessors["getInt"]() / 2) - 5;
        var points = classes[firstClass]["skill"] + intMod;

        if (points < 1) {
            points = 1;
        }

        var points = points * 3;
        var classLevels = classAndCharacterLevel["classLevels"];

        for (var cls in classLevels) {

            var thesePoints = classes[cls]["skill"] + intMod;

            if (thesePoints < 1) {
                thesePoints = 1;
            }

            points += classLevels[cls] * thesePoints;

        }

        return points;
    }

    accessors["getUnspentSkillPoints"] = function() {

        // TODO subtract spent skill points
        return accessors["getTotalSkillPoints"]() - source["accessors"]["getTotalSkillPoints"]();

    }

    // field change handlers -----------------------------------------------
    function createChangeHandler(g, field, propName) {

        var listener;

        function h() {

            g();

            if (destination) {

                destination["changeHandlers"][propName]();

            }

        }

        field.change(h);
        changeHandlers[propName] = h;

    }

    function updateEcl(characterLevel, la) {

        eclDisplay.empty();

        if (characterLevel > 0) {
            eclDisplay.append(characterLevel + la);
        }

    }

    createChangeHandler(function() {

        var classCode = classUi.val();
        var levelDetails = accessors["getClassAndCharacterLevel"]();
        var classLevels = levelDetails["classLevels"];
        classLevelDisplay.empty();

        if (classCode == "") {

            hpRollUi.setActiveField(0);
            laChangeUi.setActiveField(0);

        }
        else {

            hpRollUi.setActiveField(1);
            laChangeUi.setActiveField(1);
            classLevelDisplay.append(classLevels[classCode]);

        }

        hpRollUi.change();
        laChangeUi.change();
        // update character level
        characterLevelDisplay.empty();
        var characterLevel = levelDetails["characterLevel"];
        babDisplay.empty();
        fortDisplay.empty();
        refDisplay.empty();
        willDisplay.empty();
        defDisplay.empty();
        repDisplay.empty();

        if (characterLevel > 0) {

            characterLevelDisplay.append(characterLevel);

            // update bonuses
            var cls = classes[classCode];
            var bab = 0;
            var fort = 0;
            var ref = 0;
            var will = 0;
            var def = 0;
            var rep = 0;

            for (var classCode in classLevels) {

                bab += classes[classCode]["bab"](classLevels[classCode]);
                fort += classes[classCode]["fort"](classLevels[classCode]);
                ref += classes[classCode]["ref"](classLevels[classCode]);
                will += classes[classCode]["will"](classLevels[classCode]);
                def += classes[classCode]["def"](classLevels[classCode]);
                rep += classes[classCode]["rep"](classLevels[classCode]);

            }

            babDisplay.append(formatSignedIntegerNumber(bab));
            fortDisplay.append(formatSignedIntegerNumber(fort));
            refDisplay.append(formatSignedIntegerNumber(ref));
            willDisplay.append(formatSignedIntegerNumber(will));
            defDisplay.append(formatSignedIntegerNumber(def));
            repDisplay.append(formatSignedIntegerNumber(rep));

        }

        // update ECL
        updateEcl(characterLevel, accessors["getTotalLevelAdjustment"]());
        changeHandlers["skillPointsChange"]();

    }, classUi, "classChange");

    // LA
    createChangeHandler(function() {

        // update total LA
        var totalLa = accessors["getTotalLevelAdjustment"]();
        totalLevelAdjustmentDisplay.empty();

        if (totalLa > 0) {

            totalLevelAdjustmentDisplay.append(formatNonZeroNumber(totalLa));

        }

        // update ECL
        updateEcl(accessors["getClassAndCharacterLevel"]()["characterLevel"], totalLa);

    }, laChangeUi, "levelAdjustmentChange");

    // ability scores
    nameLoop(function(name) {

        var ability = abilities[name];
        var field = ability["field"];

        createChangeHandler(function() {

            var inListener = ability["inListener"];
            ability["display"].empty().append(
                    formatWholeNumber(accessors[ability["getName"]]()));

            if (typeof inListener === "function") {
                inListener();
            }

        }, field, ability["changeName"]);

    });

    // hp
    createChangeHandler(function() {

        hpTotalDisplay.empty();

        var hp = accessors["getHpTotal"]();

        if (hp > 0) {
            hpTotalDisplay.append(hp);
        }

    }, hpRollUi, "hpChange");

    // skill points
    createChangeHandler(function() {

        var skillPoints = accessors["getBonusSkillPoints"]() +
        accessors["getTotalSkillPoints"]();
        totalSkillPointsDisplay.empty();

        if (skillPoints > 0) {
            totalSkillPointsDisplay.append(skillPoints);

            var unspentPoints = accessors["getUnspentSkillPoints"]();

            if (unspentPoints != 0) {
                unspentSkillPointsDisplay.empty().append(unspentPoints);
            }
        }

    }, bonusSkillPointsUi, "skillPointsChange");

    rowUi.ndx = 0;
    accessors["setSource"] = function(newSource) {

        // only change if different source
        if (newSource != source) {

            if (source == null) {

                var row = newSource;

                while (row["accessors"]["getSource"]) {

                    rowUi.ndx++;
                    row = row["accessors"]["getSource"]();

                }
            }

            source = newSource;
            source["accessors"]["setDestination"](rowUi);
            var classLevels = source["accessors"]["getClassAndCharacterLevel"]();

            if (classLevels === null) {

                classUi.setActiveField(1);
                bonusSkillPointsUi.setActiveField(1);

            }

        }

        deleteUi.empty().append(source.ndx + ":" + rowUi.ndx + ":" + (destination == null ? null : destination.ndx));

    };

    accessors["getSource"] = function() {return source;};

    accessors["setDestination"] = function(dest) {

        destination = dest;

        if (destination != null) {
            destination["accessors"]["setSource"](rowUi);
        }

        deleteUi.empty().append(source.ndx + ":" + rowUi.ndx + ":" + (destination == null ? null : destination.ndx));

    };

    accessors["getDestination"] = function() {return destination;};

    return rowUi;

}

var table;

$(document).ready(function() {

    var abilities = {
        "str" : {
            "field": createAbilityScoreField(),
            "getName": "getStr",
            "changeName": "strChange",
            "label": "Str:"
        },
        "dex" : {
            "field": createAbilityScoreField(),
            "getName": "getDex",
            "changeName": "dexChange",
            "label": "Dex:"
        },
        "con" : {
            "field": createAbilityScoreField(),
            "getName": "getCon",
            "changeName": "conChange",
            "label": "Con:"
        },
        "int" : {
            "field": createAbilityScoreField(),
            "getName": "getInt",
            "changeName": "intChange",
            "label": "Int:"
        },
        "wis" : {
            "field": createAbilityScoreField(),
            "getName": "getWis",
            "changeName": "wisChange",
            "label": "Wis:"
        },
        "cha" : {
            "field": createAbilityScoreField(),
            "getName": "getCha",
            "changeName": "chaChange",
            "label": "Cha:"
        }
    };

    var ptsSpent = tx("");

    function calculatePointsSpent() {

        function pointSpent(score) {

            return isNaN(score) ?
                    2 :
                    (score > 14 ? Math.floor((score - 11) / 2) + pointSpent(score - 1) : score - 8);

        }

        var points = 0;

        nameLoop(function(name) {
            points += pointSpent(parseInt(abilities[name]["field"].val()));
        });

        return points;
    }

    function abilityChange(name) {

        var handler;
        var ability = abilities[name];
        var field = ability["field"];

        field.change(function() {

            ptsSpent.empty().append(calculatePointsSpent());
            racialRow["changeHandlers"][ability["changeName"]]();

        });

        return function(f) {

            if (typeof f == "function") {

                handler = f;

            }
            else {

                field.change();

            }

        };

    }

    var source = {

        "ndx": null,
        "accessors" : {
            "getClassAndCharacterLevel": function() {return null;},
            "getTotalLevelAdjustment": function() {return 0;},
            "getHpTotal": function() {return 0;},
            "getBonusSkillPoints": function() {return 0;},
            "getTotalSkillPoints": function() {return 0;},
            "getUnspentSkillPoints": function() {return 0;},
            "getDestination": function() {},
            "setDestination": function() {}
        },

        "changeHandlers": {
            "classChange": function() {},
            "levelAdjustmentChange": function() {},
            "hpChange": function() {},
            "skillPointsChange": function() {}
        }

    };

    nameLoop(function(name) {

        var ability = abilities[name];

        source["accessors"][ability["getName"]] = function() {
            return parseInt(ability["field"].val());
        };

        source["changeHandlers"][ability["changeName"]] = abilityChange(name);

    });

    var racialRow = createRowFields();
    source["accessors"]["getDestination"] = function(){return racialRow;};
    racialRow["accessors"]["setSource"](source);
    var startRow = createRowFields();
    racialRow["accessors"]["setDestination"](startRow);

    function getLastRow() {

        var row = racialRow["accessors"]["getDestination"]();
        var next = row["accessors"]["getDestination"]();

        while (next) {

            row = next;
            next = row["accessors"]["getDestination"]();

        }

        return row;
    }

    var tableRows = _("tbody", {}, [
        startRow
    ]).sortable({
        start: function(e, ui) {
            var prev = ui.item.prev();
            var src = prev.length == 0 ? racialRow : prev[0];
            // The helper row is created and inserted after this row before start is called.
            var next = ui.item.next().next();
            var dest = next.length == 0 ? null : next[0];

            src["accessors"]["setDestination"](dest);

        },
        stop: function(e, ui) {
            var prev = ui.item.prev();
            var src = prev.length == 0 ? racialRow : prev[0];
            var next = ui.item.next();
            var dest = next.length == 0 ? null : next[0];
            var current = ui.item[0];

            src["accessors"]["setDestination"](current);
            current["accessors"]["setDestination"](dest);

            for (var name in racialRow["changeHandlers"]) {
                racialRow["changeHandlers"][name]();
            }
        }
    });

    table = _("table", {}, [
        _("thead", {}, [
            _("tr", {}, [
                createTableHeader({"rowspan":"3"}, tx("")),
                createTableHeader({"rowspan":"3"}, tx("Class")),
                createTableHeader({"colspan":"5"}, tx("Levels")),
                createTableHeader({"rowspan":"3"}, tx("Adjustments")),
                createTableHeader({"colspan":"12", "rowspan":"2"}, tx("Ability Scores, Increases, and Decreases")),
                createTableHeader({"colspan":"2", "rowspan":"2"}, tx("Hit Points")),
                createTableHeader({"rowspan":"3"}, tx("Feats")),
                createTableHeader({"rowspan":"3"}, tx("Special Abilities")),
                createTableHeader({"colspan":"6"}, tx("Bonuses")),
                createTableHeader({"rowspan":"2", "colspan":"3"}, tx("Skill Points"))
            ]),
            _("tr", {}, [
                createTableHeader({"rowspan":"2", }, tx("Class")),
                createTableHeader({"rowspan":"2", }, tx("Character")),
                createTableHeader({"colspan":"2"}, tx("Adjustment")),
                createTableHeader({"rowspan":"2", }, tx("EC")),
                createTableHeader({"rowspan":"2"}, tx("Atk")),
                createTableHeader({"colspan":"3"}, tx("Saves")),
                createTableHeader({"rowspan":"2"}, tx("Def")),
                createTableHeader({"rowspan":"2"}, tx("Rep"))
            ]),
            _("tr", {}, [
                createTableHeader({}, tx("Total")),
                createTableHeader({}, tx("\u0394")),
                createTableHeader({}, tx("Str")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Dex")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Con")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Int")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Wis")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Cha")),
                createTableHeader({}, tx("+/\u2212")),
                createTableHeader({}, tx("Roll")),
                createTableHeader({}, tx("Total")),
                createTableHeader({}, tx("Fort")),
                createTableHeader({}, tx("Ref")),
                createTableHeader({}, tx("Will")),
                createTableHeader({}, tx("Bonus")),
                createTableHeader({}, tx("Total")),
                createTableHeader({}, tx("Unspent"))
            ])
        ]),
        _("tbody", {}, [
            racialRow
        ]),
        tableRows
    ]);

    $(document.body).append(
        tx("Character Name:"),
        createTextField(),
        tx("Player:"),
        createTextField(),
        _("br"),
        tx("Starting Scores:"),
        _("br"));

    nameLoop(function(name) {
        var ability = abilities[name];
        $(document.body).append(tx(ability["label"]), ability["field"]);
    });

    var addRowButton = _("button", {}, tx("Add Row")).click(function() {

        var newRow = createRowFields();
        getLastRow()["accessors"]["setDestination"](newRow);

        for (var name in newRow["changeHandlers"]) {
            newRow["changeHandlers"][name]();
        }

        tableRows.append(newRow);

    });

    $(document.body).append(

        tx("Points Spent:"), ptsSpent,
        _("div", {}, [
            table
        ]).css({"overflow-x":"auto", "width":"100%"}),
        addRowButton

    );

    for (var name in racialRow["changeHandlers"]) {
        racialRow["changeHandlers"][name]();
    }

});
