var jazzdotTemplates = require('./jazzdotTemplates.json');

function getView(path) {
	if (!(this instanceof getView))
		return new getView(path);

	var template = jazzdotTemplates[path];
	if (!template) throw new Error('A template at ' + path + ' was not found.');

	this.path = path;
	this.createElement = createElement.bind(this);
	this.keyAllowed = keyAllowed.bind(this);

	this.view = {
		activate: this.activate.bind(this),
		deactivate: this.deactivate.bind(this),
		populate: this.populate.bind(this)
	};

	this.rootElements = [];
	template.forEach(function(templateElement) {
		this.rootElements.push(this.createElement(templateElement));
	}.bind(this));

	return this.view;
}

getView.prototype.activate = function(parentElement) {
	this.rootElements.forEach(function(element) {
		parentElement.appendChild(element);
	});
}

getView.prototype.populate = function(data) {
	for (var key in data) {
		if (key in this.view && keyAllowed(key)) {
			var element = data[key];
			if (element instanceof Array)
				element.forEach(function(subElement) {
					var subData = {};
					subData[key] = subElement;
					this.populate(subData);
				}.bind(this));
			else if (isDOMNode(element))
				this.view[key].appendChild(element);
			else
				this.view[key].appendChild(document.createTextNode(element));
		}
	}
}

getView.prototype.deactivate = function() {
	this.rootElements.forEach(function(element) {
		element.parentElement.removeChild(element);
	});
}

function createElement(templateElement) {
	var elementType = templateElement.type;
	if (elementType == 'text')
		return document.createTextNode(templateElement.data);

	var element = document.createElement(templateElement.name);
	var attributes = templateElement.attribs;
	if (attributes) {
		for (var attributeName in attributes) {
			var attributeValue = attributes[attributeName];
			if (attributeName == 'data-id' && keyAllowed(attributeValue)) {
				this.view[attributeValue] = element;
			} else
				element.setAttribute(attributeName, attributeValue);
		};
	}

	var children = templateElement.children;
	if (children) {
		children.forEach(function(child) {
			element.appendChild(this.createElement(child));
		}.bind(this))
	}

	return element;
}

function keyAllowed(dataId) {
	if (dataId == 'activate' || dataId == 'deactivate' || dataId == 'populate') {
		console.error('The view ' + this.path + ' contains a data-id named ' + dataId + '. Attributes named "activate", "deactivate" and "populate" are not allowed.');
		return false;
	}
	return true;
}

function getTemplate(path) {
	for (var i = jazzdotTemplates.length - 1; i >= 0; i--) {
		if (jazzdotTemplates[i][path])
			return jazzdotTemplates[i][path]
	};
}

function isDOMNode(obj) {
	//Returns true if it is a DOM node
	function isNode(obj) {
		return (
			typeof Node === "object" ? obj instanceof Node :
			obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
		);
	}

	//Returns true if it is a DOM element
	function isElement(obj) {
		return (
			typeof HTMLElement === "object" ? obj instanceof HTMLElement :
			obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
		);
	}

	return isNode(obj) || isElement(obj);
}

module.exports = getView;
