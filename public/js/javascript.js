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
    $('#SensorSubmitButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addSensorEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#SensorSubmitButton').attr("disabled", false);
        alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#SensorForm').trigger("reset");
      },
      error: function(res) {
        $('#SensorSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
});

//AJAX for timeForm (addTimeEvent)
$(document).ready(function() {
  $('#TimeForm').submit(function(e) {
    e.preventDefault();
    $('#TimeSubmitButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addTimeEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
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

//AJAX for periodicForm (addPeriodicEvent)
$(document).ready(function() {
  $('#PeriodicForm').submit(function(e) {
    e.preventDefault();
    $('#PeriodicSubmitButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addPeriodicEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#PeriodicSubmitButton').attr("disabled", false);
        alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#PeriodicForm').trigger("reset");
      },
      error: function(res) {
        $('#PeriodicSubmitButton').attr("disabled", false);
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
    let select = document.getElementById("chart_interval")
    let datagram = {interval: select.value}
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
      },
      error: function(res) {
        console.error("Could not contact server to update charts!")
      }
    });
  }, REFRESH_INTERVAL)
});

function generateChart(sensorID, sensorUnits, data, sensorType){    
  let config = generateChartConfig(sensorUnits, data, sensorType)
  let ctx = document.getElementById(sensorID + '-canvas').getContext("2d");
  window.myLine = new Chart(ctx, config)
}

function generateChartConfig(sensorUnits, data, sensorType){ 
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
  switch (sensorType) {
    case 'Temperature':
      if (sensorUnits == "°C" || sensorUnits == "C") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 10     
        config.options.scales.yAxes[0].ticks.suggestedMax = 27
      } else if (sensorUnits == "°F" || sensorUnits == "F") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 50     
        config.options.scales.yAxes[0].ticks.suggestedMax = 80
      }
      break;
    case 'Humidity':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 40     
      config.options.scales.yAxes[0].ticks.suggestedMax = 60
      break;
    case 'Pressure':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 99     
      config.options.scales.yAxes[0].ticks.suggestedMax = 102
      break;
    case 'CarbonDioxide':      
      break;
  
    default:
      break;
  }
  return config
}

// Ajax for on change of chart interval
$(document).ready(function() {
  $('#chart_interval').on('change', function() {
    let select = document.getElementById("chart_interval")
    $('#chart_interval').attr("disabled", true);
    let datagram = {interval: select.value}
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#chart_interval').attr("disabled", false);
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
      },
      error: function(res) {
        $('#chart_interval').attr("disabled", false);
        alert("Could not update charts.");
      }
    });
  })
})