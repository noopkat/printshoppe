(function() {
  var socket = io.connect('http://localhost:8000');

  socket.on('job:change:status:done', function(data) {
    this.currentJob = ko.computed(function() {
      return ko.utils.arrayFilter(model.jobs(), function(Job) {
        return Job.key === data.index;
      });
    });

    this.currentJob()[0].status(data.status);
  });

  function AppViewModel() {
    var self = this;
    var observableList = []; 

    for (var i = 0; i < jobData.length; i ++) {
      var date = parseInt(jobData[i].date);
      jobData[i].humanDate = new Date(date);
      var status = jobData[i].status;
      // make status observable
      jobData[i].status = ko.observable(status); 
      observableList.push(jobData[i]); 
    }

    console.log(jobData);
        
    self.jobs = ko.observableArray(observableList);

    socket.on('job:new', function(data) {
      var date = parseInt(data.date);
      var status = data.status;
      // make status observable
      data.status = ko.observable(status);
      data.humanDate = new Date(date);
      self.jobs.push(data);
    });

    self.hide = function(status) {
      $('.'+status).toggle();
    }


    ko.bindingHandlers.statusChange = {
      init: function(element) {
        var statusInput = $(element);
       
        statusInput.change(function() {
          var data = {
            'index': $(this).attr('data-key'),
            'key': 'job~' + $(this).attr('data-key'),
            'status': $(this).val()
          }

          socket.emit('job:change:status', data);
        });
          
      }
    };

  }

  var model = new AppViewModel();
  ko.applyBindings(model);
})();