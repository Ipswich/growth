import json
import os
import random
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
# Values will only be passed if exit code is 3.


# print("Arguments: ")
# print(sys.argv[1:])

SCRIPT_DIRECTORY = "./scripts/"

# Make some random output numbers
random.seed(time.time())
Output_Value = random.randint(0,1)
OutputPWM_Value = Output_Value * random.randint(1, 100)

# Write to file
filename = os.path.basename(__file__).split('.')[0]
f = open(SCRIPT_DIRECTORY + filename + '.txt', 'w')
data = dict({"output": Output_Value, "outputPWM": OutputPWM_Value})
f.write(json.dumps(data))
f.close

sys.exit(3)