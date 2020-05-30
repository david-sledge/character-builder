//var debug = false;

/*
 * style class names used:
 *   option-available - indicates that the player has a choice to make regarding
 *     the field(s) in question
 *   deficit - too many skill points have been spent at the given level
 *   surplus - too few skill points have been spent at the given level
 *   odd - odd numbered row
 *   even - even numbered row
 *   cl-skill - class skill. Ranks cost 1 skill point each
 *   cc-skill - cross-class skill. Ranks cost 2 skill points each
 */

function _(tagName, attrs, children) {
    return $("<" + tagName + ">", attrs).append(children);
}

function appendText(elem, string) {
    return $(elem).append(document.createTextNode(string));
}

function tx(string, attrs) {
    return _("div", attrs, document.createTextNode(string)).css({"display": "inline-block"});
}

function parseSignedInt(string) {
    return parseInt(string.trim().split("\u2212").join("-"));
}

function textField(props) {
    var attrs = {};

    if (props != undefined && props != null) {
        Object.assign(attrs, props);
    }

    Object.assign(attrs, {"type": "text"});

    return _("input", attrs);
}

function modifierField() {

    var field = textField({"maxlength": 3}).css({"text-align": "center", "width": "2em"}).numeric(
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

                field.val("-" + text.substring(1));

            }
            else if (text.charAt(0) == "+") {

                field.val(text.substring(1));

            }

        }

    }).blur(function() {

        field.val(formatNonZeroNumber(field.val()));

    });

}

function nonNegIntField() {

    return textField({"maxlength": 3})
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

function abilityScoreField() {

    return nonNegIntField().val(8);

}

function wholeNumberField() {

    var field = nonNegIntField();

    return field.blur(function() {

        if (field.val() == "0") {
            field.val("");
        }

    })

}

function naturalNumberField() {

    var field = wholeNumberField();

    return field.keypress(function(e) {

        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

        if (field.prop("selectionStart") === 0 && key == 48) {
            return false;
        }

    })

}

function wholeNumberDisplay() {

    return tx("").css({"text-align": "right", "width": "100%", "min-width": "2em"});

}

function modifierDisplay() {

    return tx("").css({"text-align": "center", "width": "100%", "min-width": "2em"});

}

var adHocFixQueue = [];

function fitCell(elem) {
    adHocFixQueue.push(elem);
    return elem.css({"box-sizing": "border-box", "min-width": elem.css("width"), "width": "100%"});
}

function val($elem) {
    return $elem.css("visibility") === "visible" ? $elem.val() : "";
}

function textArea(props) {
    var attrs = {};

    if (props != undefined && props != null) {
        Object.assign(attrs, props);
    }

    return _("textarea", attrs);
}

function tableHeading(attrs, children) {
    return _("th", attrs, children).css({"vertical-align": "bottom"});
}

function tableCell(attrs, children) {
    return _("td", attrs, children).css({"vertical-align": "top"});
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

function formatSignedInteger(value) {

    if (!isNaN(value)) {
        if (value < 0) {
            return "\u2212" + (-value);
        }

        return "+" + value;
    }

    return "";

}

function formatInteger(value) {

    if (!isNaN(value)) {
        if (value < 0) {
            return "\u2212" + (-value);
        }

        return value;
    }

    return "";

}

//------------------------------------------------------------------------------

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

function ranksDisplay() {
    return fitCell(wholeNumberDisplay());
}

function languageField() {
    return textField().css({"width": "6em"});
}

var skills = {
    "a": {
        "name": "Autohypnosis",
        "displayFunc": ranksDisplay
    },
    "ba": {
        "name": "Balance",
        "displayFunc": ranksDisplay
    },
    "bl": {
        "name": "Bluff",
        "displayFunc": ranksDisplay
    },
    "cl": {
        "name": "Climb",
        "displayFunc": ranksDisplay
    },
    "com": {
        "name": "Computer Use",
        "displayFunc": ranksDisplay
    },
    "con": {
        "name": "Concentration",
        "displayFunc": ranksDisplay
    },
    "cr-c": {
        "name": "Craft (chemical)",
        "displayFunc": ranksDisplay
    },
    "cr-e": {
        "name": "Craft (electronic)",
        "displayFunc": ranksDisplay
    },
    "cr-m": {
        "name": "Craft (mechanical)",
        "displayFunc": ranksDisplay
    },
    "cr-p": {
        "name": "Craft (pharmaceutical)",
        "displayFunc": ranksDisplay
    },
    "cr-s": {
        "name": "Craft (structural)",
        "displayFunc": ranksDisplay
    },
    "cr-v": {
        "name": "Craft (visual art)",
        "displayFunc": ranksDisplay
    },
    "cr-w": {
        "name": "Craft (writing)",
        "displayFunc": ranksDisplay
    },
    "dec": {
        "name": "Decipher Script",
        "displayFunc": ranksDisplay
    },
    "dem": {
        "name": "Demolitions",
        "displayFunc": ranksDisplay
    },
    "dip": {
        "name": "Diplomacy",
        "displayFunc": ranksDisplay
    },
    "disa": {
        "name": "Disable Device",
        "displayFunc": ranksDisplay
    },
    "disg": {
        "name": "Disguise",
        "displayFunc": ranksDisplay
    },
    "dr": {
        "name": "Drive",
        "displayFunc": ranksDisplay
    },
    "e": {
        "name": "Escape Artist",
        "displayFunc": ranksDisplay
    },
    "f": {
        "name": "Forgery",
        "displayFunc": ranksDisplay
    },
    "ga": {
        "name": "Gamble",
        "displayFunc": ranksDisplay
    },
    "gi": {
        "name": "Gather Information",
        "displayFunc": ranksDisplay
    },
    "ha": {
        "name": "Handle Animal",
        "displayFunc": ranksDisplay
    },
    "hi": {
        "name": "Hide",
        "displayFunc": ranksDisplay
    },
    "int": {
        "name": "Intimidate",
        "displayFunc": ranksDisplay
    },
    "inv": {
        "name": "Investigate",
        "displayFunc": ranksDisplay
    },
    "j": {
        "name": "Jump",
        "displayFunc": ranksDisplay
    },
    "k-al": {
        "name": "Knowledge (arcane lore)",
        "displayFunc": ranksDisplay
    },
    "k-ar": {
        "name": "Knowledge (art)",
        "displayFunc": ranksDisplay
    },
    "k-bs": {
        "name": "Knowledge (behavior sciences)",
        "displayFunc": ranksDisplay
    },
    "k-bu": {
        "name": "Knowledge (business)",
        "displayFunc": ranksDisplay
    },
    "k-ci": {
        "name": "Knowledge (civics)",
        "displayFunc": ranksDisplay
    },
    "k-cu": {
        "name": "Knowledge (current events)",
        "displayFunc": ranksDisplay
    },
    "k-e": {
        "name": "Knowledge (earth and life sciences)",
        "displayFunc": ranksDisplay
    },
    "k-h": {
        "name": "Knowledge (history)",
        "displayFunc": ranksDisplay
    },
    "k-ph": {
        "name": "Knowledge (physical sciences)",
        "displayFunc": ranksDisplay
    },
    "k-po": {
        "name": "Knowledge (popular culture)",
        "displayFunc": ranksDisplay
    },
    "k-s": {
        "name": "Knowledge (streetwise)",
        "displayFunc": ranksDisplay
    },
    "k-ta": {
        "name": "Knowledge (tactics)",
        "displayFunc": ranksDisplay
    },
    "k-te": {
        "name": "Knowledge (technology)",
        "displayFunc": ranksDisplay
    },
    "k-th": {
        "name": "Knowledge (theology and philosophy)",
        "displayFunc": ranksDisplay
    },
    "l": {
        "name": "Listen",
        "displayFunc": ranksDisplay
    },
    "m": {
        "name": "Move Silently",
        "displayFunc": ranksDisplay
    },
    "n": {
        "name": "Navigate",
        "displayFunc": ranksDisplay
    },
    "pe-a": {
        "name": "Perform (act)",
        "displayFunc": ranksDisplay
    },
    "pe-d": {
        "name": "Perform (dance)",
        "displayFunc": ranksDisplay
    },
    "pe-k": {
        "name": "Perform (keyboards)",
        "displayFunc": ranksDisplay
    },
    "pe-p": {
        "name": "Perform (percussion instruments)",
        "displayFunc": ranksDisplay
    },
    "pe-si": {
        "name": "Perform (sing)",
        "displayFunc": ranksDisplay
    },
    "pe-sta": {
        "name": "Perform (stand-up)",
        "displayFunc": ranksDisplay
    },
    "pe-str": {
        "name": "Perform (stringed instruments)",
        "displayFunc": ranksDisplay
    },
    "pe-w": {
        "name": "Perform (wind instruments)",
        "displayFunc": ranksDisplay
    },
    "pi": {
        "name": "Pilot",
        "displayFunc": ranksDisplay
    },
    "pr": {
        "name": "Profession",
        "displayFunc": ranksDisplay
    },
    "ps": {
        "name": "Psicraft",
        "displayFunc": ranksDisplay
    },
    "rea": {
        "name": "Read/Write Language",
        "displayFunc": languageField
    },
    "rep": {
        "name": "Repair",
        "displayFunc": ranksDisplay
    },
    "res": {
        "name": "Research",
        "displayFunc": ranksDisplay
    },
    "ri": {
        "name": "Ride",
        "displayFunc": ranksDisplay
    },
    "sea": {
        "name": "Search",
        "displayFunc": ranksDisplay
    },
    "sen": {
        "name": "Sense Motive",
        "displayFunc": ranksDisplay
    },
    "sl": {
        "name": "Sleight of Hand",
        "displayFunc": ranksDisplay
    },
    "spe": {
        "name": "Speak Language",
        "displayFunc": languageField
    },
    "spel": {
        "name": "Spellcraft",
        "displayFunc": ranksDisplay
    },
    "spo": {
        "name": "Spot",
        "displayFunc": ranksDisplay
    },
    "su": {
        "name": "Survival",
        "displayFunc": ranksDisplay
    },
    "sw": {
        "name": "Swim",
        "displayFunc": ranksDisplay
    },
    "tr": {
        "name": "Treat Injury",
        "displayFunc": ranksDisplay
    },
    "tu": {
        "name": "Tumble",
        "displayFunc": ranksDisplay
    },
    "u": {
        "name": "Use Magic Device",
        "displayFunc": ranksDisplay
    }
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
            "cl",
            "cr-s",
            "ha",
            "j",
            "k-cu",
            "k-po",
            "k-s",
            "k-ta",
            "pr",
            "rea",
            "rep",
            "spe",
            "sw"
        ]
    }
};

var abilities = {
    "str" : {
        "getName": "getStr",
        "changeName": "strChange",
        "label": "Str:"
    },
    "dex" : {
        "getName": "getDex",
        "changeName": "dexChange",
        "label": "Dex:"
    },
    "con" : {
        "getName": "getCon",
        "changeName": "conChange",
        "label": "Con:"
    },
    "int" : {
        "getName": "getInt",
        "changeName": "intChange",
        "label": "Int:"
    },
    "wis" : {
        "getName": "getWis",
        "changeName": "wisChange",
        "label": "Wis:"
    },
    "cha" : {
        "getName": "getCha",
        "changeName": "chaChange",
        "label": "Cha:"
    }
};

function nameLoop(f) {

    for (var name in abilities) {

        var ability = abilities[name];
        f(name, ability["getName"], ability["changeName"], ability["label"]);

    }

}

function rowFields() {

    var source = null;
    var destination = null;

    var changeHandlers = {};
    var accessors = {};

    // editable fields -----------------------------------------------------
    var deleteUi = _("button", {}, "\u2297").css({"color": "red"});
    var classSelectUi = _("select", {}, [
        _("option", {"value": ""}, [document.createTextNode("-- none --")]),
        _("option", {"value": "0"}, [document.createTextNode("Strong hero")])
    ]);
    var classUi = classSelectUi;
    var laChangeUi = fitCell(modifierField());
    var charAdjustUi = textArea().css({"vertical-align": "top"});
    var abilityItems = {
        "str": {
            "listener" : null
        },
        "dex": {
            "listener" : null
        },
        "con": {
            "listener" : function() {
                changeHandlers["hpChange"]();
            }
        },
        "int": {
            "listener" : function() {
                changeHandlers["skillPointsChange"]();
            }
        },
        "wis": {
            "listener" : null
        },
        "cha": {
            "listener" : null
        }
    };
    var hpRollUi = fitCell(naturalNumberField()).css({"visibility": "hidden"});
    var featsUi = textArea();
    var specialAbilitiesUi = textArea();
    var bonusSkillPointsTextUi = fitCell(wholeNumberField());
    var bonusSkillPointsUi = bonusSkillPointsTextUi;

    // display-only fields -------------------------------------------------
    var classLevelDisplay = wholeNumberDisplay();
    var characterLevelDisplay = wholeNumberDisplay();
    var totalLevelAdjustmentDisplay = modifierDisplay();
    var eclDisplay = wholeNumberDisplay();
    var hpTotalDisplay = wholeNumberDisplay();
    var babDisplay = modifierDisplay();
    var fortDisplay = modifierDisplay();
    var refDisplay = modifierDisplay();
    var willDisplay = modifierDisplay();
    var defDisplay = modifierDisplay();
    var repDisplay = modifierDisplay();
    var totalSkillPointsDisplay = wholeNumberDisplay();
    var unspentSkillPointsDisplay = wholeNumberDisplay();

    var $rowUi = _("tr", {}, [
        // Delete
        tableCell({}, deleteUi),
        // Class/HD
        tableCell({}, classUi),
        // Class/HD level
        tableCell({}, classLevelDisplay),
        // Character level
        tableCell({}, characterLevelDisplay),
        // Total level adjustment
        tableCell({}, totalLevelAdjustmentDisplay),
        // Change in level adjustment
        tableCell({}, laChangeUi),
        // Effective character level
        tableCell({}, eclDisplay),
        // Character adjustments
        tableCell({}, charAdjustUi)
    ]);

    var abilityScoreCells = $();

    nameLoop(function(name) {

        var abilityItem = abilityItems[name];
        abilityItem["field"] = fitCell(modifierField());
        abilityItem["display"] = wholeNumberDisplay();
        abilityScoreCells = abilityScoreCells.add(
            // ability score
            tableCell({}, [abilityItem["display"]])).add(
            // increase or decrease
            tableCell({}, [abilityItem["field"]])
        );

    });

    var featsCell = tableCell({}, featsUi);

    $rowUi.append(
        abilityScoreCells,
        // Hit point roll
        tableCell({}, hpRollUi),
        // Hit point total
        tableCell({}, hpTotalDisplay),
        // Feats
        featsCell,
        // Special Abilities
        tableCell({}, specialAbilitiesUi),
        // Base attack bonus
        tableCell({}, babDisplay),
        // Base Fort save bonus
        tableCell({}, fortDisplay),
        // Base Ref save bonus
        tableCell({}, refDisplay),
        // Base Will save bonus
        tableCell({}, willDisplay),
        // Def bonus
        tableCell({}, defDisplay),
        // Rep bonus
        tableCell({}, repDisplay),
        // Bonus skill points
        tableCell({}, bonusSkillPointsUi),
        // Cumulative total skill points
        tableCell({}, totalSkillPointsDisplay),
        // Unspent skill points
        tableCell({}, unspentSkillPointsDisplay)
    ).prop({

        "changeHandlers": changeHandlers,
        "accessors": accessors

    });

    var skillRanksUis = {};

    for (var name in skills) {

        skillRanksUis[name] = {
            "display": skills[name]["displayFunc"](),
            "field": fitCell(wholeNumberField())
        };

        var fields = [
            tableCell({}, skillRanksUis[name]["display"]),
            tableCell({}, skillRanksUis[name]["field"])
        ];
        $rowUi.append(fields);

    }

    var rowUi = $rowUi[0];

    // data accessors ------------------------------------------------------
    accessors["getClassAndCharacterLevel"] = function() {

        var classCode = val(classUi);
        var levels = source["accessors"]["getClassAndCharacterLevel"]();

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
            "firstClass": firstClass,
            "lastClass": classCode == "" ? levels["lastClass"] : classCode

        };

    };

    accessors["getTotalLevelAdjustment"] = function() {

        var change = parseSignedInt(val(laChangeUi));

        return source["accessors"]["getTotalLevelAdjustment"]() + (isNaN(change) ? 0 : change);

    };

    function getEcl() {
        // TODO
    }

    nameLoop(function(name, getName, changeName) {

        var abilityItem = abilityItems[name];
        var field = abilityItem["field"];

        accessors[getName] = function () {
            var change = parseSignedInt(field.val());

            return source["accessors"][getName]() + (isNaN(change) ? 0 : change);
        };

        changeHandler(function() {

            var listener = abilityItem["listener"];
            appendText(abilityItem["display"].empty(),
                    formatWholeNumber(accessors[getName]()));

            if (typeof listener === "function") {
                listener();
            }

        }, field, changeName);

    });

    accessors["getHpRolls"] = function() {

        var hpRoll = parseInt(val(hpRollUi));

        if (hpRollUi.css("visibility") === "visible") {

            if (isNaN(hpRoll)) {
                return null;
            }

        }

        var rolls = source["accessors"]["getHpRolls"]();

        if (rolls == null) {
            return rolls;
        }

        rolls.push(hpRoll);

        // return a copy
        return rolls.slice();

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

        var bonusSkillPoints = parseInt(val(bonusSkillPointsUi));

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

        var remainPoints = accessors["getTotalSkillPoints"]() -
            source["accessors"]["getTotalSkillPoints"]();

        for (var name in skillRanksUis) {
            var spent = parseInt(val(skillRanksUis[name]["field"]));

            if (isNaN(spent)) {
                spent = 0;
            }

            remainPoints -= spent;
        }

        return remainPoints;

    }

    deleteUi.click(function() {

        var dest = destination;
        $rowUi.remove();
        source["accessors"]["setDestination"](destination);
        source = null;
        destination = null;

        if (dest) {

            for (var name in dest["changeHandlers"]) {
                dest["changeHandlers"][name]();
            }
        }

    });

    // field change handlers -----------------------------------------------
    function changeHandler(g, field, propName) {

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
            appendText(eclDisplay, characterLevel + (isNaN(la) ? 0 : la));
        }

    }

    changeHandler(function() {

        var classCode = val(classUi);
        var classAndCharacterLevel = accessors["getClassAndCharacterLevel"]();
        var classLevels = classAndCharacterLevel["classLevels"];
        classLevelDisplay.empty();

        if (classCode == "") {

            hpRollUi.css({"visibility": "hidden"});
            laChangeUi.css({"visibility": "visible"});

        }
        else {

            hpRollUi.css({"visibility": "visible"});
            laChangeUi.css({"visibility": "hidden"});
            appendText(classLevelDisplay, classLevels[classCode]);

        }

        hpRollUi.change();
        laChangeUi.change();
        // update character level
        characterLevelDisplay.empty();
        var characterLevel = classAndCharacterLevel["characterLevel"];
        babDisplay.empty();
        fortDisplay.empty();
        refDisplay.empty();
        willDisplay.empty();
        defDisplay.empty();
        repDisplay.empty();

        if (characterLevel > 0) {

            appendText(characterLevelDisplay, characterLevel);

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

            appendText(babDisplay, formatSignedInteger(bab));
            appendText(fortDisplay, formatSignedInteger(fort));
            appendText(refDisplay, formatSignedInteger(ref));
            appendText(willDisplay, formatSignedInteger(will));
            appendText(defDisplay, formatSignedInteger(def));
            appendText(repDisplay, formatSignedInteger(rep));

            var classSkills = classes[classAndCharacterLevel["lastClass"]]["skills"];

            for (var name in skillRanksUis) {

                var isClassSkill = classSkills.includes(name);
                skillRanksUis[name]["field"][isClassSkill ? "addClass" : "removeClass"]("cl-skill");
                skillRanksUis[name]["field"][isClassSkill ? "removeClass" : "addClass"]("cc-skill");

            }

//            for (var ndx = 0; ndx < classSkills.length; ndx++) {
//                console.log(classSkills[ndx]);
//                skillRanksUis[classSkills[ndx]]["field"].val("1");
//            }

//            for (var name in skillRanksUis) {
//                var spent = parseInt(val(skillRanksUis[name]["field"]));
//
//                if (isNaN(spent)) {
//                    spent = 0;
//                }
//
//                remainPoints -= spent;
//            }

        }
        else {

            for (var name in skillRanksUis) {

                skillRanksUis[name]["field"]["removeClass"]("cc-skill");

            }

        }

        // update ECL
        updateEcl(characterLevel, accessors["getTotalLevelAdjustment"]());

        var hasLeveledUp = characterLevel > 0 && characterLevel != source["accessors"]["getClassAndCharacterLevel"]()["characterLevel"];

        // add/remove CCS class to ability score cells
        abilityScoreCells[hasLeveledUp && characterLevel % 4 == 0 ? "addClass" : "removeClass"]("option-available");

        // add/remove CCS class to feat cells
        featsCell[hasLeveledUp && (characterLevel % 3 == 0 || characterLevel == 1) ? "addClass" : "removeClass"]("option-available");

        // recalculate skill points
        changeHandlers["skillPointsChange"]();

    }, classUi, "classChange");

    // LA
    changeHandler(function() {

        // update total LA
        var totalLa = accessors["getTotalLevelAdjustment"]();
        totalLevelAdjustmentDisplay.empty();

        if (totalLa > 0) {

            appendText(totalLevelAdjustmentDisplay, formatNonZeroNumber(totalLa));

        }

        // update ECL
        updateEcl(accessors["getClassAndCharacterLevel"]()["characterLevel"], totalLa);

    }, laChangeUi, "levelAdjustmentChange");

    // hp
    changeHandler(function() {

        hpTotalDisplay.empty();

        var hpRolls = accessors["getHpRolls"]();

        if (hpRolls != null) {

            var totalHp = 0;

            for (var ndx = 0; ndx < hpRolls.length; ndx++) {

                var hpRoll = hpRolls[ndx];

                if (!isNaN(hpRoll)) {

                    var hp = hpRoll +
                        Math.floor(accessors["getCon"]() / 2) - 5;

                    if (hp < 1) {
                        hp = 1;
                    }

                    totalHp += hp;

                }

            }

            if (totalHp > 0) {
                appendText(hpTotalDisplay, totalHp);
            }

        }

    }, hpRollUi, "hpChange");

    // skill points
    changeHandler(function() {

        var skillPoints = accessors["getBonusSkillPoints"]() +
            accessors["getTotalSkillPoints"]();
        totalSkillPointsDisplay.empty();

        if (skillPoints > 0) {
            appendText(totalSkillPointsDisplay, skillPoints);
        }

        var unspentPoints = accessors["getUnspentSkillPoints"]();
        unspentSkillPointsDisplay.empty();

        if (unspentPoints != 0) {

            appendText(unspentSkillPointsDisplay, formatInteger(unspentPoints));

        }

        unspentSkillPointsDisplay[unspentPoints > 0 ? "addClass" : "removeClass"]("surplus");
        unspentSkillPointsDisplay[unspentPoints < 0 ? "addClass" : "removeClass"]("deficit");

    }, bonusSkillPointsUi, "skillPointsChange");

    for (var name in skillRanksUis) {
        skillRanksUis[name]["field"].change(changeHandlers["skillPointsChange"]);
    }

    // skill points
    changeHandlers["orderChange"] = function() {

        var sourceIsOdd = $(source).hasClass("odd");
        $rowUi[sourceIsOdd ? "removeClass" : "addClass"]("odd");
        $rowUi[sourceIsOdd ? "addClass" : "removeClass"]("even");

        if (destination) {
            destination["changeHandlers"]["orderChange"]();
        }

    };

    accessors["setSource"] = function(newSource) {

        // only change if different source
        if (newSource != source) {

            source = newSource;
            $rowUi.css({"cursor": "move"});
            // this row can be deleted if there is at least one other beyond the racial adjustment row
            deleteUi.css({"visibility": destination || source["changeHandlers"] ? "" : "hidden"});

        }

    };

    accessors["getSource"] = function() {return source;};

    accessors["setDestination"] = function(dest) {

        destination = dest;

        if (destination != null) {
            destination["accessors"]["setSource"](rowUi);
        }

        deleteUi.css({"visibility": destination || source["changeHandlers"] ? "" : "hidden"});

    };

    accessors["getDestination"] = function() {return destination;};

    return rowUi;

}

$(document).ready(function() {

    $(document.documentElement).css({"height": "100%"});

    // header start... ---------------------------------------------------------
    var startScores = {};

    var ptsSpent = tx("").css({"text-align": "right", "width": "2em"});

    function calculatePointsSpent() {

        function pointSpent(score) {

            return isNaN(score) ?
                    2 :
                    (score > 14 ? Math.floor((score - 11) / 2) + pointSpent(score - 1) : score - 8);

        }

        var points = 0;

        nameLoop(function(name) {
            points += pointSpent(parseInt(startScores[name]["field"].val()));
        });

        return points;
    }

    nameLoop(function(name, getName, changeName) {

        var startAbility = startScores[name] = {};
        var field = startAbility["field"] = abilityScoreField();

        startScores[getName] = function() {
            return parseInt(field.val());
        };

        var handler;

        field.change(function() {

            appendText(ptsSpent.empty(), calculatePointsSpent());
            changeHandlers[changeName]();

        });

    });

    appendText(ptsSpent.empty(), calculatePointsSpent());

    var header = _("div", {}, [
        tx("Character Name:"),
        textField(),
        tx("Player:"),
        textField(),
        _("br"),
        tx("Starting Scores:"),
        _("br")
    ]).css({"flex": "0 1 auto"});

    nameLoop(function(name, getName, changeName, label) {
        header.append(tx(label), startScores[name]["field"]);
    });

    header.append(tx("Points Spent:"), ptsSpent);
    // header complete! --------------------------------------------------------

    // body (contains table) ---------------------------------------------------
    // table heading -----------------------------------------------------------
    var addProfessionButton = _("button", {}, "\u2295").css({"color": "green", "padding": "0px"});
    var removeProfessionButton = _("button", {}, "\u2297").css({"color": "red", "padding": "0px"});

    var tableHead = _("thead", {}, [
        _("tr", {}, [
            tableHeading({"rowspan": "3"}, tx("")),
            tableHeading({"rowspan": "3"}, tx("Class")),
            tableHeading({"colspan": "5"}, tx("Levels")),
            tableHeading({"rowspan": "3"}, tx("Adjustments")),
            tableHeading({"colspan": "12", "rowspan": "2"}, tx("Ability Scores, Increases, and Decreases")),
            tableHeading({"colspan": "2", "rowspan": "2"}, tx("Hit Points")),
            tableHeading({"rowspan": "3"}, tx("Feats")),
            tableHeading({"rowspan": "3"}, tx("Special Abilities")),
            tableHeading({"colspan": "6"}, tx("Bonuses")),
            tableHeading({"rowspan": "2", "colspan": "3"}, tx("Skill Points")),
            tableHeading({"colspan": "142"}, tx("Skills (rank/point cost)"))
        ]),
        _("tr", {}, [
            tableHeading({"rowspan": "2"}, tx("Class")),
            tableHeading({"rowspan": "2"}, tx("Character")),
            tableHeading({"colspan": "2"}, tx("Adjust")),
            tableHeading({"rowspan": "2"}, tx("EC")),
            tableHeading({"rowspan": "2"}, tx("Atk")),
            tableHeading({"colspan": "3"}, tx("Saves")),
            tableHeading({"rowspan": "2"}, tx("Def")),
            tableHeading({"rowspan": "2"}, tx("Rep")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Autohypnosis")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Balance")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Bluff")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Climb")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Computer Use")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Concentration")),
            tableHeading({"colspan": "14"}, tx("Craft")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Decipher Script")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Demolitions")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Diplomacy")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Disable Device")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Disguise")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Drive")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Escape Artist")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Forgery")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Gamble")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Gather Information")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Handle Animal")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Hide")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Intimidate")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Investigate")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Jump")),
            tableHeading({"colspan": "28"}, tx("Knowledge")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Listen")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Move Silently")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Navigate")),
            tableHeading({"colspan": "16"}, tx("Perform")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Pilot")),
            tableHeading({"colspan": "2"}, [tx("Profession"), addProfessionButton]).css({"white-space": "nowrap"}),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Psicraft")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Read/Write Language")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Repair")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Research")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Ride")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Search")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Sense Motive")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Sleight of Hand")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Speak Language")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Spellcraft")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Spot")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Survival")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Swim")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Treat Injury")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Tumble")),
            tableHeading({"rowspan": "2", "colspan": "2"}, tx("Use Magic Device"))
        ]),
        _("tr", {}, [
            tableHeading({}, tx("Total")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Str")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Dex")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Con")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Int")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Wis")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Cha")),
            tableHeading({}, tx("\u0394")),
            tableHeading({}, tx("Roll")),
            tableHeading({}, tx("Total")),
            tableHeading({}, tx("Fort")),
            tableHeading({}, tx("Ref")),
            tableHeading({}, tx("Will")),
            tableHeading({}, tx("Bonus")),
            tableHeading({}, tx("Total")),
            tableHeading({}, tx("Unspent")),
            tableHeading({"colspan": "2"}, tx("chemical")),
            tableHeading({"colspan": "2"}, tx("electronic")),
            tableHeading({"colspan": "2"}, tx("mechanical")),
            tableHeading({"colspan": "2"}, tx("pharmaceutical")),
            tableHeading({"colspan": "2"}, tx("structural")),
            tableHeading({"colspan": "2"}, tx("visual art")),
            tableHeading({"colspan": "2"}, tx("writing")),
            tableHeading({"colspan": "2"}, tx("arcane lore")),
            tableHeading({"colspan": "2"}, tx("art")),
            tableHeading({"colspan": "2"}, tx("behavior sciences")),
            tableHeading({"colspan": "2"}, tx("business")),
            tableHeading({"colspan": "2"}, tx("civics")),
            tableHeading({"colspan": "2"}, tx("current events")),
            tableHeading({"colspan": "2"}, tx("earth and life sciences")),
            tableHeading({"colspan": "2"}, tx("history")),
            tableHeading({"colspan": "2"}, tx("physical sciences")),
            tableHeading({"colspan": "2"}, tx("popular culture")),
            tableHeading({"colspan": "2"}, tx("streetwise")),
            tableHeading({"colspan": "2"}, tx("tactics")),
            tableHeading({"colspan": "2"}, tx("technology")),
            tableHeading({"colspan": "2"}, tx("theology and philosophy")),
            tableHeading({"colspan": "2"}, tx("act")),
            tableHeading({"colspan": "2"}, tx("dance")),
            tableHeading({"colspan": "2"}, tx("keyboards")),
            tableHeading({"colspan": "2"}, tx("percussion instruments")),
            tableHeading({"colspan": "2"}, tx("sing")),
            tableHeading({"colspan": "2"}, tx("stand-up")),
            tableHeading({"colspan": "2"}, tx("stringed instruments")),
            tableHeading({"colspan": "2"}, tx("wind instruments")),
            tableHeading({"colspan": "2"}, [removeProfessionButton, textField().css({"width": "6em"})]).css({"white-space": "nowrap"})
        ])
    ]);
    // table heading complete! -------------------------------------------------

    // racial adjustments row start --------------------------------------------
    var destination = null;
    var accessors = {};
    var laChangeUi = fitCell(modifierField());
    var totalLevelAdjustmentDisplay = modifierDisplay();
    var charAdjustUi = textArea().css({"vertical-align": "top"});
    var featsUi = textArea();
    var specialAbilitiesUi = textArea();

    var $rowUi = _("tr", {}, [
        // Delete
        tableCell(),
        // Class/HD
        tableCell({}, tx("Racial adjustments")),
        // Class/HD level
        tableCell(),
        // Character level
        tableCell(),
        // Total level adjustment
        tableCell({}, totalLevelAdjustmentDisplay),
        // Change in level adjustment
        tableCell({}, laChangeUi),
        // Effective character level
        tableCell(),
        // Character adjustments
        tableCell({}, charAdjustUi)
    ]);

    var abilityScoreCells = $();
    var adjustedAbilities = {};

    nameLoop(function(name) {

        adjustedAbilities[name] = {
            "field": fitCell(modifierField()),
            "display": wholeNumberDisplay()
        };

        abilityScoreCells = abilityScoreCells.add(
            // ability score
            tableCell({}, [adjustedAbilities[name]["display"]])).add(
            // increase or decrease
            tableCell({}, [adjustedAbilities[name]["field"]])
        );

    });

    var featsCell = tableCell({}, featsUi);

    $rowUi.append(
        abilityScoreCells,
        // Hit point roll
        tableCell(),
        // Hit point total
        tableCell(),
        // Feats
        featsCell,
        // Special Abilities
        tableCell({}, specialAbilitiesUi),
        // Base attack bonus
        tableCell(),
        // Base Fort save bonus
        tableCell(),
        // Base Ref save bonus
        tableCell(),
        // Base Will save bonus
        tableCell(),
        // Def bonus
        tableCell(),
        // Rep bonus
        tableCell(),
        // Bonus skill points
        tableCell(),
        // Cumulative total skill points
        tableCell(),
        // Unspent skill points
        tableCell()
    ).prop({

        "accessors": accessors

    });

    var changeHandlers = {};

    function changeHandler(g, field, propName) {

        function h() {

            g();

            if (destination) {

                destination["changeHandlers"][propName]();

            }

        }

        field.change(h);
        changeHandlers[propName] = h;

    }

    for (var name in skills) {

//        $rowUi.append(appendText(wholeNumberDisplay(), "\u2211"),
//                appendText(wholeNumberDisplay(), "$"));
        $rowUi.append([
                // ability score
                tableCell({}, appendText(wholeNumberDisplay(), "\u2211")),
                // increase or decrease
                tableCell({}, appendText(wholeNumberDisplay(), "$"))
            ])

    }

    var rowUi = $rowUi[0];

    // data accessors ------------------------------------------------------
    accessors["getClassAndCharacterLevel"] = function() {

        return {
            "classLevels": {},
            "characterLevel": 0,
            "firstClass": null,
            "lastClass": null
        };

    };

    accessors["getTotalLevelAdjustment"] = function() {

        return parseSignedInt(val(laChangeUi));

    };

    nameLoop(function(name, getName, changeName) {

        var adjustedAbility = adjustedAbilities[name];
        var field = adjustedAbility["field"];

        accessors[getName] = function () {

            var change = parseSignedInt(field.val());

            return startScores[getName]() + (isNaN(change) ? 0 : change);

        };

        changeHandler(function() {

            appendText(adjustedAbility["display"].empty(),
                    formatWholeNumber(accessors[getName]()));

        }, field, changeName);

    });

    accessors["getHpRolls"] = function() {

        return [];

    };

    accessors["getBonusSkillPoints"] = function() {

        return 0;

    }

    accessors["getTotalSkillPoints"] = function() {

        return 0;

    }

    accessors["setDestination"] = function(dest) {

        destination = dest;

        if (destination != null) {
            destination["accessors"]["setSource"](rowUi);
        }

    };

    accessors["getDestination"] = function() {

        return destination;

    };

    // LA
    changeHandler(function() {

        // update total LA
        var totalLa = accessors["getTotalLevelAdjustment"]();
        totalLevelAdjustmentDisplay.empty();

        if (totalLa > 0) {

            appendText(totalLevelAdjustmentDisplay, formatNonZeroNumber(totalLa));

        }

    }, laChangeUi, "levelAdjustmentChange");

    var stickyRows = $(tableHead).add(
        _("tbody", {}, [
            rowUi
        ])
    );

    for (var name in changeHandlers) {
        changeHandlers[name]();
    }
    // racial adjustments row complete! ----------------------------------------

    function getLastRow() {

        var row = destination;
        var next = row["accessors"]["getDestination"]();

        while (next) {

            row = next;
            next = row["accessors"]["getDestination"]();

        }

        return row;
    }

    accessors["setDestination"](rowFields());

    var tableRows = _("tbody", {}, [
        destination
    ]).sortable({
        start: function(e, ui) {

            var prev = ui.item.prev();
            var src = prev.length == 0 ? rowUi : prev[0];
            // The helper row is created and inserted after this row before start is called.
            var next = ui.item.next().next();
            var dest = next.length == 0 ? null : next[0];
            src["accessors"]["setDestination"](dest);

            if (dest != null) {
                for (var name in dest["changeHandlers"]) {
                    dest["changeHandlers"][name]();
                }
            }
        },
        stop: function(e, ui) {

            var prev = ui.item.prev();
            var src = prev.length == 0 ? rowUi : prev[0];
            var next = ui.item.next();
            var dest = next.length == 0 ? null : next[0];
            var current = ui.item[0];
            src["accessors"]["setDestination"](current);
            current["accessors"]["setDestination"](dest);

            for (var name in current["changeHandlers"]) {
                current["changeHandlers"][name]();
            }

        }
    });

    var table = _("table", {}, [
        stickyRows,
        tableRows
    ]).css({"position": "relative", "border-collapse": "collapse"});

    var tableContainer = _("div", {}, [
        table
    ]).css({"overflow-x": "auto", "width": "100%", "flex": "1 1 auto"});
    // body (contains table) complete ------------------------------------------

    $(document.body).append(
        _("div", {}, [
            header,
            tableContainer,
            _("div", {}, [_("button", {}, tx("Add Row")).click(function() {

                var newRow = rowFields();
                getLastRow()["accessors"]["setDestination"](newRow);

                for (var name in newRow["changeHandlers"]) {
                    newRow["changeHandlers"][name]();
                }

                tableRows.append(newRow);

                adjustMinWidths();

            })]).css({"flex": "0 1 40px"})
        ]).css({"display": "flex", "flex-flow": "column", "height": "100%"})
    ).css({"height": "100%", "margin": "0px"});;

    for (var name in destination["changeHandlers"]) {
        destination["changeHandlers"][name]();
    }

    // CSS helpers
    tableContainer.css({"min-height": table.height() + 15 + "px"});

    stickyRows.children().children().each(function(ndx, elem) {
        var $elem = $(elem);
        $elem.css({"position": "sticky", "top": $elem.position().top + "px", "background": "white"});
    });

    // Inside table cells the min-width should be based on the content width.
    // However, the fill width should be based on the content plus borders and
    // padding. CSS does not have a way to accomplish this so this function
    // helps out.
    function adjustMinWidths() {

        while (adHocFixQueue.length > 0) {
            $elem = adHocFixQueue.pop();
            $elem.css("min-width", parseInt($elem.css("min-width").slice(0, -2)) + $elem.outerWidth() - $elem.width() + "px");
        }

    }

    adjustMinWidths();

});
