#!/usr/bin/python3
import json
import os
import sys
import time

####### EXAMPLE SCRIPT #######

# ARGUMENTS PASSED FROM SYSTEM: Trigger value, output pin, output PWM pin. 
# Interfacing with an arduino via firmata client will likely crash things.

# Script MUST write to a .txt file using the script name (i.e. example.py creates example.txt).
# This .txt file MUST be in the same directory as the script (./scripts)
# This output file MUST contain a dictionary with properties ```output``` and ```outputPWM```
# ```output``` MUST be either a 0 or 1, for OFF or ON.
# ```outputPWM``` MUST be a value between 0 and 100, representing percentage of duty cycle.
# Value will only be passed if exit code is 3.

SCRIPT_DIRECTORY = "./scripts/"
CURRENT_TEMPERATURE = float(sys.argv[1])

MORNING_HOURS = list([2, 3])
MORNING_HIGH = 69
MORNING_LOW = 67

DAYTIME_HOURS = list([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
DAYTIME_HIGH = 72
DAYTIME_LOW = 69

EVENING_HOURS = list([18, 19])
EVENING_HIGH = 69
EVENING_LOW = 67

NIGHTTIME_HOURS = list([0, 1, 20, 21, 22, 23])
NIGHTTIME_HIGH = 67
NIGHTTIME_LOW = 64

current_hour = time.localtime().tm_hour
Output_Value = -1
OutputPWM_Value = -1

# Morning hours
if(current_hour in MORNING_HOURS):
  # Temperature is above high, turn off
  if CURRENT_TEMPERATURE > MORNING_HIGH:
    Output_Value = 0
    OutputPWM_Value = 0
  # Temperature is below low, turn on
  elif CURRENT_TEMPERATURE < MORNING_LOW:
    Output_Value = 1
    OutputPWM_Value = 100
# Daytime hours
elif(current_hour in DAYTIME_HOURS):
  # Temperature is above high, turn off
  if CURRENT_TEMPERATURE > DAYTIME_HIGH:
    Output_Value = 0
    OutputPWM_Value = 0
  # Temperature is below low, turn on
  elif CURRENT_TEMPERATURE < DAYTIME_LOW:
    Output_Value = 1
    OutputPWM_Value = 100
# Evening hours
elif(current_hour in EVENING_HOURS):
  # Temperature is above high, turn off
  if CURRENT_TEMPERATURE > EVENING_HIGH:
    Output_Value = 0
    OutputPWM_Value = 0
  # Temperature is below low, turn on
  elif CURRENT_TEMPERATURE < EVENING_LOW:
    Output_Value = 1
    OutputPWM_Value = 100
# Nighttime hours
elif(current_hour in NIGHTTIME_HOURS):
  # Temperature is above high, turn off
  if CURRENT_TEMPERATURE > NIGHTTIME_HIGH:
    Output_Value = 0
    OutputPWM_Value = 0
  # Temperature is below low, turn on
  elif CURRENT_TEMPERATURE < NIGHTTIME_LOW:
    Output_Value = 1
    OutputPWM_Value = 100

# Temperature is in between high and low - do nothing.
if Output_Value == -1:
  sys.exit(0)

# Write to file
filename = os.path.basename(__file__).split('.')[0]
f = open(SCRIPT_DIRECTORY + filename + '.txt', 'w')
data = dict({"output": Output_Value, "outputPWM": OutputPWM_Value})
f.write(json.dumps(data))
f.close
sys.exit(3)