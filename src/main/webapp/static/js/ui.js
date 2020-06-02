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

var adHocFixStack = [];

// Inside table cells the min-width should be based on the content width.
// However, the fill width should be based on the content plus borders and
// padding. CSS does not have a way to accomplish this so this function
// helps out.
function adjustMinWidths() {

    while (adHocFixStack.length > 0) {
        $elem = adHocFixStack.pop();
        $elem.css("min-width", parseInt($elem.css("min-width").slice(0, -2)) + $elem.outerWidth() - $elem.width() + "px");
    }

}

function fitCell(elem) {
    adHocFixStack.push(elem);
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

function tableHeader(attrs, children) {
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

function propLoop(obj, f) {

    for (var name in obj) {

        f(name, obj[name]);

    }

}

function indexLoop(arr, f) {

    for (var ndx = 0; ndx < arr.length; ndx++) {

        f(ndx, arr[ndx]);

    }

}

function ranksDisplay() {
    return fitCell(wholeNumberDisplay());
}

function languageField() {
    return textField().css({"width": "6em"});
}

var skills = {
    "a": {
        "name": "Autohypnosis"
    },
    "ba": {
        "name": "Balance"
    },
    "bl": {
        "name": "Bluff"
    },
    "cl": {
        "name": "Climb"
    },
    "com": {
        "name": "Computer Use"
    },
    "con": {
        "name": "Concentration"
    },
    "cr-c": {
        "name": "chemical",
        "group": "cr"
    },
    "cr-e": {
        "name": "electronic",
        "group": "cr"
    },
    "cr-m": {
        "name": "mechanical",
        "group": "cr"
    },
    "cr-p": {
        "name": "pharmaceutical",
        "group": "cr"
    },
    "cr-s": {
        "name": "structural",
        "group": "cr"
    },
    "cr-v": {
        "name": "visual art",
        "group": "cr"
    },
    "cr-w": {
        "name": "writing",
        "group": "cr"
    },
    "dec": {
        "name": "Decipher Script"
    },
    "dem": {
        "name": "Demolitions"
    },
    "dip": {
        "name": "Diplomacy"
    },
    "disa": {
        "name": "Disable Device"
    },
    "disg": {
        "name": "Disguise"
    },
    "dr": {
        "name": "Drive"
    },
    "e": {
        "name": "Escape Artist"
    },
    "f": {
        "name": "Forgery"
    },
    "ga": {
        "name": "Gamble"
    },
    "gi": {
        "name": "Gather Information"
    },
    "ha": {
        "name": "Handle Animal"
    },
    "hi": {
        "name": "Hide"
    },
    "int": {
        "name": "Intimidate"
    },
    "inv": {
        "name": "Investigate"
    },
    "j": {
        "name": "Jump"
    },
    "k-al": {
        "name": "arcane lore",
        "group": "k"
    },
    "k-ar": {
        "name": "art",
        "group": "k"
    },
    "k-bs": {
        "name": "behavior sciences",
        "group": "k"
    },
    "k-bu": {
        "name": "business",
        "group": "k"
    },
    "k-ci": {
        "name": "civics",
        "group": "k"
    },
    "k-cu": {
        "name": "current events",
        "group": "k"
    },
    "k-e": {
        "name": "earth and life sciences",
        "group": "k"
    },
    "k-h": {
        "name": "history",
        "group": "k"
    },
    "k-ph": {
        "name": "physical sciences",
        "group": "k"
    },
    "k-po": {
        "name": "popular culture",
        "group": "k"
    },
    "k-s": {
        "name": "streetwise",
        "group": "k"
    },
    "k-ta": {
        "name": "tactics",
        "group": "k"
    },
    "k-te": {
        "name": "technology",
        "group": "k"
    },
    "k-th": {
        "name": "theology and philosophy",
        "group": "k"
    },
    "l": {
        "name": "Listen"
    },
    "m": {
        "name": "Move Silently"
    },
    "n": {
        "name": "Navigate"
    },
    "pe-a": {
        "name": "act",
        "group": "pe"
    },
    "pe-d": {
        "name": "dance",
        "group": "pe"
    },
    "pe-k": {
        "name": "keyboards",
        "group": "pe"
    },
    "pe-p": {
        "name": "percussion instruments",
        "group": "pe"
    },
    "pe-si": {
        "name": "sing",
        "group": "pe"
    },
    "pe-sta": {
        "name": "stand-up",
        "group": "pe"
    },
    "pe-str": {
        "name": "stringed instruments",
        "group": "pe"
    },
    "pe-w": {
        "name": "wind instruments",
        "group": "pe"
    },
    "pi": {
        "name": "Pilot"
    },
    "pr": {
        "name": "Profession"
    },
    "ps": {
        "name": "Psicraft"
    },
    "rea": {
        "name": "Read/Write Language"
    },
    "rep": {
        "name": "Repair"
    },
    "res": {
        "name": "Research"
    },
    "ri": {
        "name": "Ride"
    },
    "sea": {
        "name": "Search"
    },
    "sen": {
        "name": "Sense Motive"
    },
    "sl": {
        "name": "Sleight of Hand"
    },
    "spe": {
        "name": "Speak Language"
    },
    "spel": {
        "name": "Spellcraft"
    },
    "spo": {
        "name": "Spot"
    },
    "su": {
        "name": "Survival"
    },
    "sw": {
        "name": "Swim"
    },
    "tr": {
        "name": "Treat Injury"
    },
    "tu": {
        "name": "Tumble"
    },
    "u": {
        "name": "Use Magic Device"
    }
};

// according to the ECMA specification order is neither guaranteed nor predictable.
var skillOrder = [
    "a",
    "ba",
    "bl",
    "cl",
    "com",
    "con",
    {
        "group": "cr",
        "name": "Craft",
        "order": [
            "cr-c",
            "cr-e",
            "cr-m",
            "cr-p",
            "cr-s",
            "cr-v",
            "cr-w"
        ]
    },
    "dec",
    "dem",
    "dip",
    "disa",
    "disg",
    "dr",
    "e",
    "f",
    "ga",
    "gi",
    "ha",
    "hi",
    "int",
    "inv",
    "j",
    {
        "group": "k",
        "name": "Knowledge",
        "order": [
            "k-al",
            "k-ar",
            "k-bs",
            "k-bu",
            "k-ci",
            "k-cu",
            "k-e",
            "k-h",
            "k-ph",
            "k-po",
            "k-s",
            "k-ta",
            "k-te",
            "k-th"
        ]
    },
    "l",
    "m",
    "n",
    {
        "group": "pe",
        "name": "Perform",
        "order": [
            "pe-a",
            "pe-d",
            "pe-k",
            "pe-p",
            "pe-si",
            "pe-sta",
            "pe-str",
            "pe-w"
        ]
    },
    "pi",
    {
        "group": "pr",
        "name": "Profession",
        "order": [
            "pr"
        ]
    },
    "ps",
    "rea",
    "rep",
    "res",
    "ri",
    "sea",
    "sen",
    "sl",
    "spe",
    "spel",
    "spo",
    "su",
    "sw",
    "tr",
    "tu",
    "u"
];

var skillGroups = {
    "cr": function(text) {
        return tx(text)
    },
    "k": function(text) {
        return tx(text)
    },
    "pe": function(text) {
        return tx(text)
    },
    "pr": function(text, button) {
        return _("div", {}, [tx(text), button]).css({"white-space": "nowrap", "display": "inline-block"});
    }
}

function skillNameLoop(f) {

    propLoop(skills, function(name, skill) {

        f(name, skill);

    })

}

var classes = {
    "0": {
        "name": "Strong hero",
        "type": "cls",
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

function classNameLoop(f) {

    propLoop(classes, function(name, cls) {

        f(name, cls["name"], cls["bab"], cls["fort"], cls["ref"], cls["will"],
            cls["def"], cls["rep"], cls["skill"], cls["skills"]);

    })

}

var abilities = {
    "str" : {
        "getName": "getStr",
        "changeName": "strChange",
        "label": "Str"
    },
    "dex" : {
        "getName": "getDex",
        "changeName": "dexChange",
        "label": "Dex"
    },
    "con" : {
        "getName": "getCon",
        "changeName": "conChange",
        "label": "Con"
    },
    "int" : {
        "getName": "getInt",
        "changeName": "intChange",
        "label": "Int"
    },
    "wis" : {
        "getName": "getWis",
        "changeName": "wisChange",
        "label": "Wis"
    },
    "cha" : {
        "getName": "getCha",
        "changeName": "chaChange",
        "label": "Cha"
    }
};

function abilityNameLoop(f) {

    propLoop(abilities, function(name, ability) {

        f(name, ability["getName"], ability["changeName"], ability["label"]);

    })

}

var countProfessions;

function newProfCells() {

    return {
        "rank": tableCell({}, skillRanksUi["display"]),
        "cost": tableCell({}, skillRanksUi["field"])
    };

}

function row() {

    // character data from previous adjustments
    var source = null;
    // next adjustments to which to feed character data
    var destination = null;

    // triggers to be called by source when changes are made upstream
    var changeHandlers = {};
    // getters and setters to be called by destination to get character data
    var accessors = {};
    // triggers, getters, setters, and UI components for skill cells
    var skillRanks = {
        "changeRanks": {}
    };

    // UI for character class options with pre-populated values
    var classOptions = [
        _("option", {"value": ""}, [document.createTextNode("-- choose your path... --")]),
        // this indicates a change due to something other than gaining a class
        // level. Some examples are template applications, aging effects, and
        // wish-increased ability scores. This is also used with LA buyoffs.
        _("option", {"value": ""}, [document.createTextNode("off-level changes")])
    ];

    // add available character classes to selector
    classNameLoop(function(name, className) {
        classOptions.push(_("option", {"value": name}, [document.createTextNode(className)]));
    });

    // delete row button
    var deleteUi = _("button", {}, "\u2297").css({"color": "red"});

    // editable fields -----------------------------------------------------

    // character class selector
    var classUi = _("select", {}, classOptions);
    // change in level adjustment text field
    var laChangeUi = fitCell(modifierField());
    // free text describing adjustments to character
    var charAdjustUi = textArea().css({"vertical-align": "top"});
    // ability score UI components, getters, setters, and listeners
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
    // hit points rolled at this level UI
    var hpRollUi = fitCell(naturalNumberField()).css({"visibility": "hidden"});
    // feats gained at this level/adjustment UI
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

    abilityNameLoop(function(name) {

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
        "accessors": accessors,
        "skillRanks": skillRanks

    });

    var subSkillCells = [];
    var skillRanksUis = {};

    $rowUi.prop("addSubSkill", function() {
        return function(name) {

            var skillRanksUi = skillRanksUis[name];
            var ndx = skillRanksUi.length;
            var changeRanks = skillRanks["changeRanks"][name];
            var ranksUi = {
                "display": ranksDisplay(),
                "field": fitCell(wholeNumberField())
            };
            skillRanksUi[ndx] = ranksUi;
            subSkillCells[ndx] = [
                tableCell({}, ranksUi["display"]),
                tableCell({}, ranksUi["field"])
            ];

            if (accessors["getClassAndCharacterLevel"]) {

                var classAndCharacterLevel = accessors["getClassAndCharacterLevel"]();

                if (classAndCharacterLevel["characterLevel"] > 0) {

                    var isClassSkill = classes[classAndCharacterLevel["lastClass"]]["skills"].includes(name);
                    ranksUi["field"][isClassSkill ? "addClass" : "removeClass"]("cl-skill");
                    ranksUi["field"][isClassSkill ? "removeClass" : "addClass"]("cc-skill");

                }
                else {

                    ranksUi["field"]["removeClass"]("cl-skill");
                    ranksUi["field"]["removeClass"]("cc-skill");

                }

            }

            if (ndx == 0) {

                $rowUi.append(subSkillCells[ndx]);

            }
            else {
                subSkillCells[ndx - 1][1].after(subSkillCells[ndx]);
            }

            changeRanks[ndx] = function() {

                var ranks = skillRanks["getTotalRanks"](name, ndx);
                ranksUi["display"].empty();

                if (ranks > 0) {
                    appendText(ranksUi["display"], ranks);
                }

                if (destination) {
                    destination["skillRanks"]["changeRanks"][name][ndx]();
                }

            };

            ranksUi["field"].change(function() {

                changeRanks[ndx]();
                changeHandlers["skillPointsChange"]();

            });

            if (destination) {
                destination["addSubSkill"](name);
            }
        };
    });

    $rowUi.prop("removeSubSkill", function() {
        return function(name, ndx) {

            var cells = subSkillCells.splice(ndx, 1)[0];
            cells[0].remove();
            cells[1].remove();
            cells = skillRanksUis[name].splice(ndx, 1)[0];
            changeHandlers["skillPointsChange"]();

            if (destination) {
                destination["removeSubSkill"](name, ndx);
            }

        };

    });

    skillNameLoop(function(name) {

        if (name == "pr") {

            skillRanksUis[name] = [];
            skillRanks["changeRanks"][name] = [];

            for (var ndx = 0; ndx < countProfessions(); ndx++) {

                $rowUi.prop("addSubSkill")(name);

            }

        }
        else {

            var skillRanksUi = {
                    "display": (name == "rea" || name == "spe" ? languageField: ranksDisplay)(),
                    "field": fitCell(wholeNumberField())
                };
            skillRanksUis[name] = skillRanksUi;

            $rowUi.append(tableCell({}, skillRanksUi["display"]),
                    tableCell({}, skillRanksUi["field"]));

            skillRanks["changeRanks"][name] = (
                name == "rea" || name == "spe" ?
                function() {} :
                function() {
                    var ranks = skillRanks["getTotalRanks"](name);
                    skillRanksUi["display"].empty();

                    if (ranks > 0) {
                        appendText(skillRanksUi["display"], ranks);
                    }

                    if (destination) {
                        destination["skillRanks"]["changeRanks"][name]();
                    }
                });

            skillRanksUi["field"].change(function() {

                skillRanks["changeRanks"][name]();
                changeHandlers["skillPointsChange"]();

            });

        }

    });

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

        propLoop(classLevels, function(name, classLevel) {

            characterLevel += classLevels[name];

            if (firstClass == null) {

                firstClass = name;

            }

        });

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

    abilityNameLoop(function(name, getName, changeName) {

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

    function getUnspentSkillPoints() {

        var remainPoints = accessors["getTotalSkillPoints"]() -
            source["accessors"]["getTotalSkillPoints"]();

        propLoop(skillRanksUis, function(name, skillRanksUi) {

            function f(ranksUi) {

                var spent = parseInt(val(ranksUi["field"]));

                if (isNaN(spent)) {
                    spent = 0;
                }

                remainPoints -= spent;

            }

            if (Array.isArray(skillRanksUi)) {

                indexLoop(skillRanksUi, function(ndx, ranksUi) {

                    f(ranksUi);

                });

            }
            else {

                f(skillRanksUi);

            }

        });

        return remainPoints;

    }

    skillRanks["getTotalRanks"] = function(name, ndx) {

        var remainPoints = accessors["getTotalSkillPoints"]();
        var ranks = source["skillRanks"]["getTotalRanks"](name, ndx);
        var field = Array.isArray(skillRanksUis[name])
            ? skillRanksUis[name][ndx]["field"]
            : skillRanksUis[name]["field"];
        var spent = parseInt(val(field));

        if (isNaN(spent) || spent == 0) {
            return ranks;
        }

        // last class has it as a class skill?
        var lastClass = accessors["getClassAndCharacterLevel"]()["lastClass"];

        return ranks + (spent / (lastClass == null || classes[lastClass]["skills"].includes(name) ? 1 : 2.0));

    }

    deleteUi.click(function() {

        var dest = destination || source["changeHandlers"] ? destination : row();

        if (!(destination || source["changeHandlers"])) {

            $rowUi.after(dest);
            adjustMinWidths();

        }

        $rowUi.remove();
        source["accessors"]["setDestination"](dest);
        source = null;
        destination = null;

        if (dest) {

            propLoop(dest["changeHandlers"], function(name, chgHandler) {

                chgHandler();

            });

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

            propLoop(skillRanksUis, function(name, skillRanksUi) {

                var isClassSkill = classSkills.includes(name);
                function f(ranksUi) {

                    ranksUi["field"][isClassSkill ? "addClass" : "removeClass"]("cl-skill");
                    ranksUi["field"][isClassSkill ? "removeClass" : "addClass"]("cc-skill");

                }

                if (Array.isArray(skillRanksUi)) {

                    indexLoop(skillRanksUi, function(ndx, ranksUi) {

                        f(ranksUi);

                    });

                }
                else {

                    f(skillRanksUi);

                }

            });

        }
        else {

            function f(ranksUi) {

                ranksUi["field"]["removeClass"]("cl-skill");
                ranksUi["field"]["removeClass"]("cc-skill");

            }

            propLoop(skillRanksUis, function(name, skillRanksUi) {

                if (Array.isArray(skillRanksUi)) {

                    indexLoop(skillRanksUi, function(ndx, ranksUi) {
                        f(ranksUi);
                    });

                }
                else {
                    f(skillRanksUi);
                }

            });

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

        propLoop(skillRanks["changeRanks"], function(name, changeRank) {

            if (Array.isArray(changeRank)) {

                indexLoop(changeRank, function(ndx, chgRank) {
                    chgRank();
                });

            }
            else {
                changeRank();
            }

        });

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

            indexLoop(hpRolls, function(ndx, hpRoll) {

                if (!isNaN(hpRoll)) {

                    var hp = hpRoll +
                        Math.floor(accessors["getCon"]() / 2) - 5;

                    if (hp < 1) {
                        hp = 1;
                    }

                    totalHp += hp;

                }

            });

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

        var unspentPoints = getUnspentSkillPoints();
        unspentSkillPointsDisplay.empty();

        if (unspentPoints != 0) {

            appendText(unspentSkillPointsDisplay, formatInteger(unspentPoints));

        }

        unspentSkillPointsDisplay[unspentPoints > 0 ? "addClass" : "removeClass"]("surplus");
        unspentSkillPointsDisplay[unspentPoints < 0 ? "addClass" : "removeClass"]("deficit");

    }, bonusSkillPointsUi, "skillPointsChange");

    // row reordering
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

        }

    };

    accessors["getSource"] = function() {return source;};

    accessors["setDestination"] = function(dest) {

        destination = dest;

        if (destination != null) {
            destination["accessors"]["setSource"](rowUi);
        }

    };

    accessors["getDestination"] = function() {return destination;};

    return rowUi;

}

$(document).ready(function() {

    var scrollbarHeight = (function getScrollBarHeight () {
        var inner = _("p").css({"width": "200px", "height": "100%"});

        var outer = _("div", {}, inner).css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "visibility": "hidden",
            "width": 150,
            "height": 200,
            "overflow": "hidden"});

        $(document.body).append(outer);
        var w1 = inner.outerHeight();
        outer.css("overflow", 'scroll');
        var w2 = inner.outerHeight();

        outer.remove();

        return (w1 - w2);
    })();

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

        abilityNameLoop(function(name) {
            points += pointSpent(parseInt(startScores[name]["field"].val()));
        });

        return points;
    }

    abilityNameLoop(function(name, getName, changeName) {

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
        tx("Starting Scores:")
    ]).css({"flex": "0 1 auto"});

    abilityNameLoop(function(name, getName, changeName, label) {
        header.append(tx(label + ":"), startScores[name]["field"]);
    });

    header.append(tx("Points Spent:"), ptsSpent);
    // header complete! --------------------------------------------------------

    // body (contains table) ---------------------------------------------------
    // table header --------------------------------------------------------
    var skillsHeader = tableHeader({"colspan": Object.keys(skills).length * 2}, tx("Skills (rank/point cost)"));
    var headerRow1 = [
        tableHeader({"rowspan": "3"}, tx("")),
        tableHeader({"rowspan": "3"}, tx("Class")),
        tableHeader({"colspan": "5"}, tx("Levels")),
        tableHeader({"rowspan": "3"}, tx("Adjustments")),
        tableHeader({"colspan": "12", "rowspan": "2"}, tx("Ability Scores, Increases, and Decreases")),
        tableHeader({"colspan": "2", "rowspan": "2"}, tx("Hit Points")),
        tableHeader({"rowspan": "3"}, tx("Feats")),
        tableHeader({"rowspan": "3"}, tx("Special Abilities")),
        tableHeader({"colspan": "6"}, tx("Bonuses")),
        tableHeader({"rowspan": "2", "colspan": "3"}, tx("Skill Points"))
    ];

    var firstSkillCol = 0;

    indexLoop(headerRow1, function(ndx, headRow) {

        var colspan = parseInt(headRow.attr("colspan"));

        if (!(colspan > 1)) {
            colspan = 1;
        }

        firstSkillCol += colspan;

    });

    headerRow1.push(skillsHeader);

    var headerRow2 = [
        tableHeader({"rowspan": "2"}, tx("Class")),
        tableHeader({"rowspan": "2"}, tx("Character")),
        tableHeader({"colspan": "2"}, tx("Adjust")),
        tableHeader({"rowspan": "2"}, tx("EC")),
        tableHeader({"rowspan": "2"}, tx("Atk")),
        tableHeader({"colspan": "3"}, tx("Saves")),
        tableHeader({"rowspan": "2"}, tx("Def")),
        tableHeader({"rowspan": "2"}, tx("Rep"))
    ];
    var headerRow3 = [
        tableHeader({}, tx("Total")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Str")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Dex")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Con")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Int")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Wis")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Cha")),
        tableHeader({}, tx("\u0394")),
        tableHeader({}, tx("Roll")),
        tableHeader({}, tx("Total")),
        tableHeader({}, tx("Fort")),
        tableHeader({}, tx("Ref")),
        tableHeader({}, tx("Will")),
        tableHeader({}, tx("Bonus")),
        tableHeader({}, tx("Total")),
        tableHeader({}, tx("Unspent"))
    ];

    var skillHeaderGroups = {};
    var professionHeader;

    function profHeader() {

        var removeProfessionButton = _("button", {}, "\u2297").css({
            "color": "red",
            "padding": "0px"
        });

        var tHeader = tableHeader({"colspan": "2"},
                [_("div", {}, [
                    removeProfessionButton,
                    textField().css({"width": "6em"})
                ]).css({"white-space": "nowrap", "display": "inline-block"})]
            );

        removeProfessionButton.click(function() {

            if (professionHeaders.length == 1) {
                addProfessionButton.click();
            }

            var ndx = professionHeaders.indexOf(tHeader);
            destination.removeSubSkill("pr", ndx);
            var cells = profCells.splice(ndx, 1)[0];
            cells["rank"].remove();
            cells["cost"].remove();
            var profHeader = professionHeaders.splice(ndx, 1)[0];
            profHeader.remove();
            var colspan = parseInt(skillsHeader.attr("colspan"));
            skillsHeader.attr("colspan", colspan - 2);
            colspan = parseInt(professionHeader.attr("colspan"));
            professionHeader.attr("colspan", colspan - 2);
        });

        return tHeader;

    }

    var professionHeaders = [profHeader()];

    var addProfessionButton = _("button", {}, "\u2295").css({
        "color": "green",
        "padding": "0px"
    }).click(function() {

        var colspan = parseInt(professionHeader.attr("colspan"));
        professionHeader.attr("colspan", colspan + 2);
        colspan = parseInt(skillsHeader.attr("colspan"));
        skillsHeader.attr("colspan", colspan + 2);
        professionHeaders.push(profHeader());
        professionHeaders[professionHeaders.length - 2].after(professionHeaders[professionHeaders.length - 1]);
        var newCells = {
            "rank": tableCell({}, appendText(wholeNumberDisplay(), "\u2211")),
            "cost": tableCell({}, appendText(wholeNumberDisplay(), "$"))
        };
        profCells.push(newCells);
        profCells[profCells.length - 2]["cost"].after(newCells["rank"], newCells["cost"]);
        makeSticky(professionHeaders[professionHeaders.length - 1]);
        makeSticky(newCells["rank"]);
        makeSticky(newCells["cost"]);
        destination["addSubSkill"]("pr");
        adjustMinWidths();

    });

    indexLoop(skillOrder, function(ndx, item) {

        if (typeof item == "string") {

            var skill = skills[item];
            headerRow2.push(tableHeader({"rowspan": "2", "colspan": "2"}, tx(skill["name"])));

        }
        else {

            var groupName = item["group"];
            var groupText = item["name"];
            var groupedSkills = item["order"];

            indexLoop(groupedSkills, function(ndx, skill) {

                if (skillHeaderGroups[groupName]) {

                    skillHeaderGroups[groupName]["colspan"] += 2;

                }
                else {

                    skillHeaderGroups[groupName] = {
                        "header": tableHeader({}, skillGroups[groupName](groupText, addProfessionButton)),
                        "colspan": 2
                    };
                    headerRow2.push(skillHeaderGroups[groupName]["header"]);

                }

                headerRow3.push(
                    groupName == "pr"
                        ? professionHeaders[0]
                        : tableHeader({"colspan": "2"}, tx(skills[skill]["name"]))
                );

                if (groupName == "pr") {

                    professionHeader = skillHeaderGroups[groupName]["header"];

                }

            });

        }

    });

    for (var name in skillHeaderGroups) {

        var skillHeaderGroup = skillHeaderGroups[name];
        skillHeaderGroup["header"].attr("colspan", skillHeaderGroup["colspan"]);

    }

    var tableHead = _("thead", {}, [
        _("tr", {}, headerRow1),
        _("tr", {}, headerRow2),
        _("tr", {}, headerRow3)
    ]);
    // table header complete! -------------------------------------------------

    // racial adjustments row start --------------------------------------------
    var destination = null;
    var accessors = {};
    var skillRanks = {};
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

    abilityNameLoop(function(name) {

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

        "accessors": accessors,
        "skillRanks": skillRanks

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

    var profCells = [];

    countProfessions = function() {

        return profCells.length;

    }

    skillNameLoop(function (name){

        var cells = [
            // ranks
            tableCell({}, appendText(wholeNumberDisplay(), "\u2211")),
            // cost
            tableCell({}, appendText(wholeNumberDisplay(), "$"))
        ];

        if (name == "pr") {
            profCells.push({"rank": cells[0], "cost": cells[1]});
        }

        $rowUi.append(cells);

    });

    var rowUi = $rowUi[0];
    //tableRows.push($rowUi);

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

    abilityNameLoop(function(name, getName, changeName) {

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

    skillRanks["getTotalRanks"] = function() {

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

    propLoop(changeHandlers, function(name, changeHandler) {
        changeHandler();
    });

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

    accessors["setDestination"](row());

    var tbodyRows = _("tbody", {}, [
        destination
    ]).sortable({
        start: function(e, ui) {

            var row = ui.item;
            var prev = row.prev();
            var src = prev.length == 0 ? rowUi : prev[0];
            // The helper row is created and inserted after this row before start is called.
            var next = row.next().next();
            var dest = next.length == 0 ? null : next[0];
            src["accessors"]["setDestination"](dest);

            if (dest != null) {
                propLoop(dest["changeHandlers"], function(name, changeHandler) {
                    changeHandler();
                });
            }
        },
        stop: function(e, ui) {

            var row = ui.item;
            var prev = row.prev();
            var src = prev.length == 0 ? rowUi : prev[0];
            var next = row.next();
            var dest = next.length == 0 ? null : next[0];
            var current = row[0];
            src["accessors"]["setDestination"](current);
            current["accessors"]["setDestination"](dest);

            propLoop(current["changeHandlers"], function(name, changeHandler) {
                changeHandler();
            });

        }
    });

    var table = _("table", {}, [
        stickyRows,
        tbodyRows
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

                var newRow = row();
                getLastRow()["accessors"]["setDestination"](newRow);

                propLoop(newRow["changeHandlers"], function(name, changeHandler) {
                    changeHandler();
                });

                tbodyRows.append(newRow);

                adjustMinWidths();

            })]).css({"flex": "0 1 40px"})
        ]).css({"display": "flex", "flex-flow": "column", "height": "100%"})
    ).css({"height": "100%", "margin": "0px"});;

    propLoop(destination["changeHandlers"], function(name, changeHandler) {
        changeHandler();
    });

    // CSS helpers
    tableContainer.css({"min-height": table.height() + scrollbarHeight + "px"});

    function makeSticky(elem) {
        elem.css({"position": "sticky", "top": elem.position().top + "px", "background": "white"});
    }

    stickyRows.children().children().each(function(ndx, elem) {
        makeSticky($(elem));
    });

    adjustMinWidths();

});
