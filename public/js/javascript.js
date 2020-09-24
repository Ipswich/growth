const REFRESH_INTERVAL = 60 * 1000 // 1 minute

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
        $('#newScheduleModal').modal('hide');
        $('#SensorForm').trigger("reset");
      },
      error: function(res) {
        $('#EventSubmitButton').attr("disabled", false);
        alert(res.responseText);
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
        $('#newScheduleModal').modal('hide');
        $('#TimeForm').trigger("reset");
      },
      error: function(res) {
        $('#TimeSubmitButton').attr("disabled", false);
        alert(res.responseText);
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
//Weirdly doesn't seem to work when placed here, so it's commented out but located
//in the PUG (updateEventMeta.pug) file under a script element.

// $(document).ready(function() {
//   $('#UpdateForm').off().submit(function(e) {
//
//     e.preventDefault();
//     $('#UpdateDeleteButton').attr("disabled", true);
//     $('#UpdateUpdateButton').attr("disabled", true);
//     var form = $(this);
//     var data = form.serializeArray();
//     $.ajax({
//       type: 'POST',
//       url: '/updateSchedule',
//       data: data,
//       cache: false,
//       success: function(res) {
//         $('#schedule').html(res.schedules);
//         $('#current-conditions').html(res.currentConditions);
//         $('#UpdateDeleteButton').attr("disabled", false);
//         $('#UpdateUpdateButton').attr("disabled", false);
//         alert(res.msg);
//         $('#updateScheduleModal').modal('hide');
//         $('#UpdateForm').trigger("reset");
//       },
//       error: function(res) {
//         $('#UpdateDeleteButton').attr("disabled", false);
//         $('#UpdateUpdateButton').attr("disabled", false);
//         console.log(res);
//         alert(res);
//       }
//     });
//   });
// });

//Conditions and schedule refresh
$(document).ready(function() {
  setInterval(function() {
    $.ajax({
    type: 'GET',
    url: '/api/getEnvironment',
    cache: false,
    success: function(res) {
      $('#schedule').html(res.schedules);
      $('#current-conditions').html(res.currentConditions);
    }
    });
  }, REFRESH_INTERVAL)
});

function generateChart(sensorID, sensorUnits, data){    
  let config = generateChartConfig(sensorUnits, data)
  let ctx = document.getElementById(sensorID + '-canvas').getContext("2d");
  window.myLine = new Chart(ctx, config)
}

function generateChartConfig(sensorUnits, data){ 
  let config = {
    type: 'line',
    data: {
      datasets: [{
        fill: false,
        label: sensorUnits, 
        data: data,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
      }]
    },
    options: {
      animation:{
        duration: 0
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 1
        }
      },
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-normal')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          type: "time",
          time: {
            // unit: 'hour',
            tooltipFormat: 'h:mm A'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          scaleLabel: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green'),
            display: true,
            labelString: sensorUnits
          }
        }]
      }
    }
  }
  return config
}