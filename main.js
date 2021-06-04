

function Autocomplete(t) {
	(this.select = t),
		(this.container = t.parent()),
		(this.wrapper = $('<div class="autocomplete"></div>')),
		this.container.append(this.wrapper),
		this.createTextBox(),
		this.createArrowIcon(),
		this.createMenu(),
		this.hideSelectBox(),
		this.createStatusBox(),
		this.setupKeys(),
		$(document).on("click", $.proxy(this, "onDocumentClick"));
}
(Autocomplete.prototype.onDocumentClick = function (t) {
	$.contains(this.container[0], t.target) ||
		(this.hideMenu(), this.removeTextBoxFocus());
}),
	(Autocomplete.prototype.setupKeys = function () {
		this.keys = {
			enter: 13,
			esc: 27,
			space: 32,
			up: 38,
			down: 40,
			tab: 9,
			left: 37,
			right: 39,
			shift: 16,
		};
	}),
	(Autocomplete.prototype.onTextBoxFocus = function () {
		this.textBox.addClass("autocomplete-isFocused");
	}),
	(Autocomplete.prototype.removeTextBoxFocus = function () {
		this.textBox.removeClass("autocomplete-isFocused");
	}),
	(Autocomplete.prototype.onTextBoxClick = function (t) {
		this.clearOptions();
		var e = this.getAllOptions();
		this.buildMenu(e),
			this.updateStatus(e.length),
			this.showMenu(),
			"function" == typeof t.currentTarget.select && t.currentTarget.select();
	}),
	(Autocomplete.prototype.onTextBoxKeyUp = function (t) {
		switch (t.keyCode) {
			case this.keys.esc:
			case this.keys.up:
			case this.keys.left:
			case this.keys.right:
			case this.keys.space:
			case this.keys.enter:
			case this.keys.tab:
			case this.keys.shift:
				break;
			case this.keys.down:
				this.onTextBoxDownPressed(t);
				break;
			default:
				this.onTextBoxType(t);
		}
	}),
	(Autocomplete.prototype.onMenuKeyDown = function (t) {
		switch (t.keyCode) {
			case this.keys.up:
				this.onOptionUpArrow(t);
				break;
			case this.keys.down:
				this.onOptionDownArrow(t);
				break;
			case this.keys.enter:
				this.onOptionEnter(t);
				break;
			case this.keys.space:
				this.onOptionSpace(t);
				break;
			case this.keys.esc:
				this.onOptionEscape(t);
				break;
			case this.keys.tab:
				this.hideMenu(), this.removeTextBoxFocus();
				break;
			default:
				this.textBox.focus();
		}
	}),
	(Autocomplete.prototype.onTextBoxType = function (t) {
		if (this.textBox.val().trim().length > 0) {
			var e = this.getOptions(this.textBox.val().trim().toLowerCase());
			this.buildMenu(e), this.showMenu(), this.updateStatus(e.length);
		} else this.hideMenu();
		this.updateSelectBox();
	}),
	(Autocomplete.prototype.updateSelectBox = function () {
		var t = this.textBox.val().trim(),
			e = this.getMatchingOption(t);
		e ? this.select.val(e.value) : this.select.val("");
	}),
	(Autocomplete.prototype.onOptionEscape = function (t) {
		this.clearOptions(), this.hideMenu(), this.focusTextBox();
	}),
	(Autocomplete.prototype.focusTextBox = function () {
		this.textBox.focus();
	}),
	(Autocomplete.prototype.onOptionEnter = function (t) {
		this.isOptionSelected() && this.selectActiveOption(), t.preventDefault();
	}),
	(Autocomplete.prototype.onOptionSpace = function (t) {
		this.isOptionSelected() && (this.selectActiveOption(), t.preventDefault());
	}),
	(Autocomplete.prototype.onOptionClick = function (t) {
		var e = $(t.currentTarget);
		this.selectOption(e);
	}),
	(Autocomplete.prototype.selectActiveOption = function () {
		var t = this.getActiveOption();
		this.selectOption(t);
	}),
	(Autocomplete.prototype.selectOption = function (t) {
		var e = t.attr("data-option-value");
		this.setValue(e), this.hideMenu(), this.focusTextBox();
	}),
	(Autocomplete.prototype.onTextBoxDownPressed = function (t) {
		var e, o, i = this.textBox.val().trim();
		0 === i.length || this.isExactMatch(i)
			? ((o = this.getAllOptions()),
				this.buildMenu(o),
				this.showMenu(),
				(e = this.getFirstOption()),
				this.highlightOption(e))
			: (o = this.getOptions(i)).length > 0 &&
			(this.buildMenu(o),
				this.showMenu(),
				(e = this.getFirstOption()),
				this.highlightOption(e));
	}),
	(Autocomplete.prototype.onOptionDownArrow = function (t) {
		var e = this.getNextOption();
		e[0] && this.highlightOption(e), t.preventDefault();
	}),
	(Autocomplete.prototype.onOptionUpArrow = function (t) {
		this.isOptionSelected() &&
			((option = this.getPreviousOption()),
				option[0]
					? this.highlightOption(option)
					: (this.focusTextBox(), this.hideMenu())),
			t.preventDefault();
	}),
	(Autocomplete.prototype.isOptionSelected = function () {
		return this.activeOptionId;
	}),
	(Autocomplete.prototype.getActiveOption = function () {
		return $("#" + this.activeOptionId);
	}),
	(Autocomplete.prototype.getFirstOption = function () {
		return this.menu.find("li").first();
	}),
	(Autocomplete.prototype.getPreviousOption = function () {
		return $("#" + this.activeOptionId).prev();
	}),
	(Autocomplete.prototype.getNextOption = function () {
		return $("#" + this.activeOptionId).next();
	}),
	(Autocomplete.prototype.highlightOption = function (t) {
		if (this.activeOptionId) {
			this.getOptionById(this.activeOptionId).attr("aria-selected", "false");
		}
		t.attr("aria-selected", "true"),
			this.isElementVisible(this.menu, t) ||
			this.menu.scrollTop(this.menu.scrollTop() + t.position().top),
			(this.activeOptionId = t[0].id),
			t.focus();
	}),
	(Autocomplete.prototype.getOptionById = function (t) {
		return $("#" + t);
	}),
	(Autocomplete.prototype.showMenu = function () {
		this.menu.removeClass("hidden"), this.textBox.attr("aria-expanded", "true");
	}),
	(Autocomplete.prototype.hideMenu = function () {
		this.menu.addClass("hidden"),
			this.textBox.attr("aria-expanded", "false"),
			(this.activeOptionId = null),
			this.clearOptions();
	}),
	(Autocomplete.prototype.clearOptions = function () {
		this.menu.empty();
	}),
	(Autocomplete.prototype.getOptions = function (t) {
		var e = [];
		return (
			this.select.find("option").each(function (o, i) {
				(($(i).val().trim().length > 0 &&
					$(i).text().toLowerCase().indexOf(t.toLowerCase()) > -1) ||
					($(i).attr("data-alt") &&
						$(i).attr("data-alt").toLowerCase().indexOf(t.toLowerCase()) >
						-1)) &&
					e.push({
						text: $(i).text(),
						value: $(i).val(),
					});
			}),
			e
		);
	}),
	(Autocomplete.prototype.getAllOptions = function () {
		for (
			var t, e = [], o = this.select.find("option"), i = 0;
			i < o.length;
			i++
		) {
			(t = o.eq(i)).val().trim().length > 0 &&
				e.push({
					text: t.text(),
					value: t.val(),
				});
		}
		return e;
	}),
	(Autocomplete.prototype.isExactMatch = function (t) {
		return this.getMatchingOption(t);
	}),
	(Autocomplete.prototype.getMatchingOption = function (t) {
		for (
			var e = null, o = this.select.find("options"), i = 0;
			i < o.length;
			i++
		)
			if (o[i].text.toLowerCase() === t.toLowerCase()) {
				e = o[i];
				break;
			}
		return e;
	}),
	(Autocomplete.prototype.buildMenu = function (t) {
		if ((this.clearOptions(), (this.activeOptionId = null), t.length))
			for (var e = 0; e < t.length; e++)
				this.menu.append(this.getOptionHtml(e, t[e]));
		else this.menu.append(this.getNoResultsOptionHtml());
		this.menu.scrollTop(this.menu.scrollTop());
	}),
	(Autocomplete.prototype.getNoResultsOptionHtml = function () {
		return '<li class="autocomplete-optionNoResults">No results</li>';
	}),
	(Autocomplete.prototype.getOptionHtml = function (t, e) {
		return (
			'<li tabindex="-1" aria-selected="false" role="option" data-option-value="' +
			e.value +
			'" id="autocomplete-option--' +
			t +
			'">' +
			e.text +
			"</li>"
		);
	}),
	(Autocomplete.prototype.createStatusBox = function () {
		(this.status = $(
			'<div aria-live="polite" role="status" class="visually-hidden" />'
		)),
			this.wrapper.append(this.status);
	}),
	(Autocomplete.prototype.updateStatus = function (t) {
		0 === t
			? this.status.text("No results.")
			: this.status.text(t + " results available.");
	}),
	(Autocomplete.prototype.hideSelectBox = function () {
		this.select.attr("aria-hidden", "true"),
			this.select.attr("tabindex", "-1"),
			this.select.addClass("visually-hidden"),
			this.select.prop("id", "");
	}),
	(Autocomplete.prototype.createTextBox = function () {
		(this.textBox = $(
			'<input autocapitalize="none" type="text" autocomplete="off">'
		)),
			this.textBox.attr("aria-owns", this.getOptionsId()),
			this.textBox.attr("aria-autocomplete", "list"),
			this.textBox.attr("role", "combobox"),
			this.textBox.prop("id", this.select.prop("id"));
			this.textBox.attr("aria-expanded", "false")
		this.select.find("option:selected").val().trim().length > 0 &&
			this.textBox.val(this.select.find("option:selected").text()),
			this.wrapper.append(this.textBox),
			this.textBox.on("click", $.proxy(this, "onTextBoxClick")),
			this.textBox.on(
				"keydown",
				$.proxy(function (t) {
					switch (t.keyCode) {
						case this.keys.tab:
							this.hideMenu(), this.removeTextBoxFocus();
					}
				}, this)
			),
			this.textBox.on("keyup", $.proxy(this, "onTextBoxKeyUp")),
			this.textBox.on("focus", $.proxy(this, "onTextBoxFocus"));
	}),
	(Autocomplete.prototype.getOptionsId = function () {
		return "autocomplete-options--" + this.select.prop("id");
	}),
	(Autocomplete.prototype.createArrowIcon = function () {
		var t = $(
			'<svg focusable="false" version="1.1" xmlns="http://www.w3.org/2000/svg"><g><polygon points="0 0 22 0 11 17"></polygon></g></svg>'
		);
		this.wrapper.append(t), t.on("click", $.proxy(this, "onArrowClick"));
	}),
	(Autocomplete.prototype.onArrowClick = function (t) {
		this.clearOptions();
		var e = this.getAllOptions();
		this.buildMenu(e),
			this.updateStatus(e.length),
			this.showMenu(),
			this.textBox.focus();
	}),
	(Autocomplete.prototype.createMenu = function () {
		(this.menu = $(
			'<ul id="' + this.getOptionsId() + '" role="listbox" class="hidden" title="make selection"></ul>'
		)),
			this.wrapper.append(this.menu),
			this.menu.on("click", "[role=option]", $.proxy(this, "onOptionClick")),
			this.menu.on("keydown", $.proxy(this, "onMenuKeyDown"));
	}),
	(Autocomplete.prototype.isElementVisible = function (t, e) {
		var o = $(t).height(),
			i = $(e).offset().top,
			n = $(t).offset().top,
			s = parseInt($(e).css("padding-top"), 10),
			r = parseInt($(e).css("padding-bottom"), 10),
			a = $(e).height() + s + r;
		return !(i - n < 0 || i - n + a > o);
	}),
	(Autocomplete.prototype.getOption = function (t) {
		return this.select.find('option[value="' + t + '"]');
	}),
	(Autocomplete.prototype.setValue = function (t) {
		this.select.val(t);
		var e = this.getOption(t).text();
		t.trim().length > 0 ? this.textBox.val(e) : this.textBox.val("");
	});
