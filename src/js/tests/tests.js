var React = require('react/addons');

var TestUtils = React.addons.TestUtils;

var ItemAvatar = require('../components/ItemAvatar');

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("ItemAvatar", function () {
	var component;

	beforeEach( function() {
		component = TestUtils.renderIntoDocument(<ItemAvatar name="Toto" />)
	});

	it('Should containe object initial', function() {
		expect(component.getDOMNode().innerText).toBe('T');
	})
});

describe('ImageUrl filter', function() {
	var ImageUrl = require('../filters/ImageUrl');
	var imageData = {
		id : '00-0000-0000-00',
		filename : 'image.jpg'
	};

	it('Should output a correct Url', () => {
		expect(ImageUrl(imageData)).toMatch(/assets\/00-0000-0000-00\/image.jpg/);
	});

	it('Should output a correct resized Url', () => {
		expect(ImageUrl(imageData, 100)).toMatch(/assets\/00-0000-0000-00\/100x100\/image.jpg/);
	});

	it('Should output a valid url if no imagename suplied', () => {
		expect(ImageUrl(imageData.id)).toMatch(/assets\/00-0000-0000-00\/image.jpg/);
	})

	it('Should output a no image', () => {
		expect(ImageUrl(undefined)).toMatch(/.\/img\/no-image.png/);
	})
})