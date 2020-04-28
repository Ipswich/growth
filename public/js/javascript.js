
//Prevent accidental form entries
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});


//AJAX for sensorForm (addSensorEvent)
$(document).ready(function() {
  $('#SensorForm').submit(function(e) {
    e.preventDefault();
    $('#EventSubmitButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addSensorEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#EventSubmitButton').attr("disabled", false);
        alert(res.msg);
      },
      error: function(res) {
        $('#EventSubmitButton').attr("disabled", false);
        alert("Server could not be reached.");
      }
    });
  });
});

//AJAX for timeForm (addTimeEvent)
$(document).ready(function() {
  $('#TimeForm').submit(function(e) {
    e.preventDefault();
    $('#submitButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addTimeEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#TimeSubmitButton').attr("disabled", false);
        alert(res.msg);
      },
      error: function(res) {
        $('#TimeSubmitButton').attr("disabled", false);
        alert("Server could not be reached.");
      }
    });
  });
});

//AJAX for generating schedule update modal
$(document).ready(function() {
  $(function(){
    $('#updateScheduleModal').modal({
      keyboard: true,
      show: false
    }).on('show.bs.modal', function(){
      var data = $(event.target).closest('tr').data('scheduleid');
      var datagram = {};
      datagram.data = data;
      $.ajax({
        type: 'POST',
        url: '/getScheduleData',
        data: datagram,
        cache: false,
        success: function(res) {
          $('#updateScheduleContent').html(res);
          $('#updateScheduleContent').collapse('show');
        },
        error: function(res) {
          alert("Server could not be reached.");
        }
      });
    }).on('hidden.bs.modal', function(){
        $('#updateScheduleContent').html("Loading. . .");
        $('#updateScheduleContent').collapse('hide');
    });
  });
});

//AJAX for updating schedule (updateSchedule.js)
$(document).ready(function() {
  $('#UpdateForm').submit(function(e) {
    e.preventDefault();
    $('#UpdateDeleteButton').attr("disabled", true);
    $('#UpdateUpdateButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/updateSchedule',
      data: data,
      cache: false,
      success: function(res) {
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);
        $('#UpdateScheduleModal').modal('hide');
        $('#UpdateScheduleModal').trigger("reset");
        alert("Schedule successfully changed.");
      },
      error: function(res) {
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);
        alert("Server could not be reached.");
      }
    });
  });
});
