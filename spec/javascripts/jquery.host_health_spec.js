describe('$.fn.hostHealth', function() {
  var subject,
      overallResponse = [
        {
          'time_stamp': '1397167308398403'
        }
      ];

  beforeEach(function() {
    jasmine.Ajax.useMock();
    fixture.load('host_health.html');
    subject = new $.PMX.HostHealth($('.health'));
    spyOn(window, 'setTimeout');
    spyOn(window, 'clearTimeout');
  });

  describe('#init', function() {
    it('queries for the overall metrics', function() {
      subject.init();
      var request = mostRecentAjaxRequest();
      expect(request.url).toBe('/host_health');
    });

    it('initiates setTimeout', function() {
      subject.init();
      var request = mostRecentAjaxRequest();

      request.response({
        status: 200,
        responseText: ''
      });
      expect(window.setTimeout).toHaveBeenCalled();
    });

    it('clears the previously set timeout', function() {
      var fakeTimer = {fakeTimer: true};
      subject.timer = fakeTimer;
      subject.init();
      var request = mostRecentAjaxRequest();

      request.response({
        status: 200,
        responseText: ''
      });
      expect(window.clearTimeout).toHaveBeenCalledWith(fakeTimer);
    });
  });

  describe('hovering on root element', function() {
    it('adds the "showing" class', function() {
      var event = $.Event('mouseenter');
      subject.init();
      $('.health').trigger(event);
      expect($('.health').hasClass('showing')).toBeTruthy
    });

    it('removes "showing" when hover off', function() {
      var $elem = $('.health'),
          event = $.Event('mouseleave');
      subject.init();
      $elem.addClass('showing');
      $elem.trigger(event);
      expect($elem.hasClass('showing')).toBeFalsy
    });

    it('displays details when showing', function() {
      subject.init();
      $('.health').click();
      expect($('.health').find('.details')).toBeDefined
    });
  });

  describe('#healthColors', function() {
    beforeEach(function() {
      spyOn(subject, 'colorLevel').andReturn('white');
      subject.init();
      subject.healthColors();
    });

    it('sets color level of the root element', function() {
      expect(subject.colorLevel).toHaveBeenCalled();
      expect($('.health').hasClass('white')).toBeTruthy();
    });

    it('sets color level of the cpu details', function() {
      var event = $.Event('mouseenter');
      $('.health').trigger(event);
      expect(subject.colorLevel).toHaveBeenCalled();
      expect($('.cpu .health').hasClass('white')).toBeTruthy();
    });

    it('sets color level of the memory details', function() {
      var event = $.Event('mouseenter');
      $('.health').trigger(event);
      expect(subject.colorLevel).toHaveBeenCalled();
      expect($('.memory .health').hasClass('white')).toBeTruthy();
    });
  });

  describe('#colorLevel', function() {
    it('returns danger when value is 90 or higher', function() {
      subject.init();
      result = subject.colorLevel(90);
      expect(result).toEqual('danger');
    });

    it('returns warning when value is 90 or higher', function() {
      subject.init();
      result = subject.colorLevel(80);
      expect(result).toEqual('warning');
    });

    it('returns good when value is below 80', function() {
      subject.init();
      result = subject.colorLevel(0);
      expect(result).toEqual('good');
    });
  });
});
