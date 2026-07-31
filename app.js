const { useState, useMemo, useEffect, useRef, useCallback } = React;
const DECKS = [
  {
    id: "vspeeds",
    code: "01",
    name: "V-Speeds & Arc Markings",
    blurb: "Every speed on the dial, and the colour it lives on.",
    cards: [
      { t: "VSO", d: "Stall speed in the landing configuration, gear and flaps down. The lower limit of the white arc." },
      { t: "VS1", d: "Stall speed in a specified configuration, usually clean. The lower limit of the green arc." },
      { t: "VFE", d: "Maximum flap-extended speed. The upper limit of the white arc." },
      { t: "VNO", d: "Maximum structural cruising speed. The top of the green arc. Do not exceed it except in smooth air." },
      { t: "VNE", d: "Never-exceed speed. The red radial line. Do not exceed it at any time." },
      { t: "VA", d: "Design maneuvering speed. Full deflection of one control will not overstress the airframe. It is not marked on the dial." },
      { t: "VX", d: "Best angle of climb. The most altitude in the shortest horizontal distance. Use it to clear an obstacle." },
      { t: "VY", d: "Best rate of climb. The most altitude in the shortest time." },
      { t: "VREF", d: "Reference landing speed for the final approach. Usually 1.3 times VSO." },
      { t: "VR", d: "Rotation speed. The speed at which you apply back pressure to rotate to the takeoff attitude." },
      { t: "VLOF", d: "Lift-off speed. The speed at which the airplane leaves the surface." },
      { t: "VLE", d: "Landing gear extended speed. The maximum speed to fly with the gear down." },
      { t: "VLO", d: "Landing gear operating speed. The maximum speed to extend or retract the gear." },
      { t: "VFO", d: "The maximum speed at which you can extend or retract the flaps." },
      { t: "VYSE", d: "Best rate of climb with one engine inoperative. The blue radial line on a twin." },
      { t: "VMC", d: "Minimum control speed with the critical engine inoperative. The red radial line on a twin. It addresses control only, not climb." },
      { t: "VSSE", d: "Safe, intentional one-engine-inoperative speed. The minimum speed to shut down the critical engine on purpose." },
      { t: "White arc", d: "The flap operating range, from VSO to VFE." },
      { t: "Green arc", d: "The normal operating range, from VS1 to VNO." },
      { t: "Yellow arc", d: "The caution range, from VNO to VNE. Fly in it in smooth air only." },
      { t: "Red radial line", d: "VNE, the never-exceed speed." },
      { t: "How do you calculate VA?", d: "VA = stall speed x the square root of the limit load factor. For the normal category the square root of 3.8 is 1.95." },
      { t: "What happens to VA as weight decreases?", d: "VA decreases. Rule of thumb: the reduction in VA is half the percentage reduction in weight." },
      { t: "What happens to VX and VY as altitude increases?", d: "VX increases and VY decreases, in true airspeed. They meet at the absolute ceiling." },
      { t: "Which V-speed is not marked on the airspeed indicator?", d: "VA, the maneuvering speed." },
      { t: "Why fly a cruise climb?", d: "It increases ground speed, improves forward visibility, and gives better engine cooling." }
    ]
  },
  {
    id: "airspace",
    code: "02",
    name: "Airspace & VFR Minimums",
    blurb: "The wedding cake, and how far you must stay from a cloud.",
    cards: [
      { t: "Class A", d: "From 18,000 ft MSL to FL600. IFR only. An instrument rating and a clearance are required. Visibility minimums do not apply." },
      { t: "Class B", d: "Around the busiest airports. An explicit ATC clearance is required to enter. Shaped like an upside-down wedding cake." },
      { t: "Class B VFR minimums", d: "3 statute miles visibility and clear of clouds." },
      { t: "Class C", d: "Around medium airports with a tower and radar. Two-way radio contact is required before entry." },
      { t: "Class C VFR minimums", d: "3 statute miles, 500 ft below, 1,000 ft above, 2,000 ft horizontal." },
      { t: "Class D", d: "Around an airport with an operating control tower. Two-way radio contact is required before entry." },
      { t: "Class D VFR minimums", d: "3 statute miles, 500 ft below, 1,000 ft above, 2,000 ft horizontal." },
      { t: "Class E below 10,000 ft MSL", d: "3 statute miles, 500 ft below, 1,000 ft above, 2,000 ft horizontal." },
      { t: "Class E at or above 10,000 ft MSL", d: "5 statute miles, 1,000 ft below, 1,000 ft above, 1 statute mile horizontal." },
      { t: "Class G at or below 1,200 ft AGL, day", d: "1 statute mile and clear of clouds." },
      { t: "Class G at or below 1,200 ft AGL, night", d: "3 statute miles, 500 ft below, 1,000 ft above, 2,000 ft horizontal." },
      { t: "Class G above 1,200 ft AGL and below 10,000 ft MSL, day", d: "1 statute mile, 500 ft below, 1,000 ft above, 2,000 ft horizontal." },
      { t: "Class G above 1,200 ft AGL and at or above 10,000 ft MSL", d: "5 statute miles, 1,000 ft below, 1,000 ft above, 1 statute mile horizontal." },
      { t: "Class G night exception", d: "Within half a mile of the runway you can operate with 1 statute mile visibility and clear of clouds." },
      { t: "Why do the VFR minimums exist?", d: "So that an IFR airplane that comes out of a cloud has time to see and avoid you. ATC separates IFR traffic, not VFR traffic." },
      { t: "Why are the Class B minimums lower than Class E?", d: "ATC is in contact with every aircraft in Class B and knows where they all are." },
      { t: "Where does Class E start?", d: "At 700 ft AGL, 1,200 ft AGL, or another charted altitude. It covers 14,500 ft MSL to 18,000 ft MSL everywhere else." },
      { t: "Special VFR", d: "A clearance you must request. ATC cannot offer it. It lets you operate below the basic VFR minimums in the surface area." },
      { t: "Ceiling and visibility to operate at an airport in controlled airspace", d: "A ceiling of at least 1,000 ft and visibility of at least 3 statute miles." },
      { t: "Blue and magenta airport symbols", d: "Blue shows an airport with a control tower. Magenta shows an airport without one." },
      { t: "Memory aid for Class E and Class G", d: "E is for elsewhere, the controlled airspace that fills the gaps. G is go for it, uncontrolled." }
    ]
  },
  {
    id: "regs",
    code: "03",
    name: "Regulations & Currency",
    blurb: "Paperwork, inspections, and the clocks that keep running.",
    cards: [
      { t: "ARROW", d: "Airworthiness certificate, Registration, Radio station licence for international flight, Operating limitations, Weight and balance data." },
      { t: "Annual inspection", d: "Required within the preceding 12 calendar months. 14 CFR 91.409(a)." },
      { t: "100-hour inspection", d: "Required if the aircraft carries persons for hire or is used for flight instruction for hire. 14 CFR 91.409(b)." },
      { t: "Transponder inspection", d: "Required within the preceding 24 calendar months. 14 CFR 91.413." },
      { t: "Static system and encoder check", d: "Required within the preceding 24 calendar months for IFR flight in controlled airspace. 14 CFR 91.411." },
      { t: "VOR equipment check", d: "Required within the preceding 30 days for IFR flight that uses VOR navigation. 14 CFR 91.171." },
      { t: "ELT inspection", d: "Required within the preceding 12 calendar months. 14 CFR 91.207(d)." },
      { t: "ELT battery replacement", d: "Replace the battery after 1 hour of cumulative use, or when 50 percent of the useful life has expired." },
      { t: "Day passenger currency", d: "Three takeoffs and landings within the preceding 90 days in the same category, class, and type if a type rating applies." },
      { t: "Night passenger currency", d: "Three takeoffs and landings to a full stop within the preceding 90 days, from 1 hour after sunset to 1 hour before sunrise." },
      { t: "Flight review", d: "Every 24 calendar months. At least 1 hour of ground instruction and 1 hour of flight instruction." },
      { t: "When is a flight review not required?", d: "When you earn a new certificate or rating. The practical test resets the 24-month clock." },
      { t: "Alcohol rule", d: "8 hours from bottle to throttle, blood alcohol below 0.04 percent, and not under the influence. 14 CFR 91.17. Many instructors advise 24 hours." },
      { t: "Operation after maintenance", d: "If the work may have changed the flight characteristics, at least a private pilot must flight test the airplane with no passengers and make a log entry. 91.407." },
      { t: "Inoperative equipment", d: "If the item is not required, placard it INOP, and deactivate or remove it. 14 CFR 91.213." },
      { t: "Airworthiness Directive", d: "A mandatory FAA notice about a condition that stops the aircraft from meeting its airworthiness requirements. Record the compliance." },
      { t: "Who is responsible for airworthiness?", d: "The owner or operator keeps the aircraft airworthy. The pilot in command decides whether the aircraft is safe for the flight." },
      { t: "Supplemental oxygen for the crew", d: "Above 12,500 ft MSL the crew must use it after 30 minutes. Above 14,000 ft MSL the crew must use it at all times. 91.211." },
      { t: "Supplemental oxygen for passengers", d: "Above 15,000 ft MSL the operator must provide oxygen to each occupant. 91.211." },
      { t: "Scuba diving before flight", d: "Wait 12 hours after a dive with no controlled ascent if you fly below 8,000 ft. Wait 24 hours after any dive if you fly above 8,000 ft." },
      { t: "BasicMed", d: "You start with a third class medical, then see a state-licensed physician every 4 years and complete an online course. Limits are in 61.113." }
    ]
  },
  {
    id: "systems",
    code: "04",
    name: "Powerplant, Fuel & Ignition",
    blurb: "Four strokes, two magnetos, and one blue fuel.",
    cards: [
      { t: "The four strokes", d: "Intake, compression, power, exhaust." },
      { t: "Magneto", d: "A self-contained generator that uses a permanent magnet to make the spark. It works with no battery and no alternator." },
      { t: "Why two spark plugs per cylinder?", d: "For redundancy and for better combustion. Two plugs give a slightly higher power output." },
      { t: "How are the plugs wired?", d: "Each magneto fires one plug in each cylinder. If one magneto fails the engine still runs, but with less power." },
      { t: "Conditions for carburetor ice", d: "An outside air temperature of 20 to 70 degrees F with high humidity. It is still possible up to 100 degrees F." },
      { t: "First sign of carburetor ice, fixed-pitch propeller", d: "A drop in RPM, then roughness, then failure." },
      { t: "What does carburetor heat do?", d: "The RPM drops first, then rises as the ice melts. Carb heat enriches the mixture and reduces power." },
      { t: "Where does carburetor heat come from?", d: "Air routed over the exhaust system, the same source as the cabin heat." },
      { t: "Detonation", d: "An uncontrolled explosive burn of the mixture in the cylinder. It causes high cylinder head temperature and a knocking sound." },
      { t: "Causes of detonation", d: "A fuel grade that is too low, a mixture that is too lean, or a steep climb in hot weather." },
      { t: "Corrective action for detonation", d: "Reduce power, lower the nose, enrich the mixture, and open the cowl flaps." },
      { t: "Pre-ignition", d: "The mixture ignites before the spark, from a hot spot in the cylinder such as a carbon deposit or a cracked plug insulator." },
      { t: "Why lean the mixture at altitude?", d: "Air density decreases but fuel density does not. The mixture becomes too rich, which causes roughness and a loss of power." },
      { t: "What causes roughness from an over-rich mixture?", d: "Spark plug fouling. The rich mixture lowers the cylinder temperature and the fuel does not burn completely." },
      { t: "Fuel injection compared to a carburetor", d: "It is less prone to induction icing, but impact icing at the air intake is still possible." },
      { t: "Fuel colours", d: "100LL is blue. Grade 80 was red and 100/130 was green. Turbine fuel is clear or straw and is hazardous to a piston engine." },
      { t: "Clear liquid in the fuel sump", d: "Usually water, often from rain. Drain it before flight." },
      { t: "Wrong fuel grade", d: "Never use a grade lower than the one specified, because it causes detonation. Use a higher grade if the correct one is not available." },
      { t: "Turbocharger", d: "It uses the exhaust gas to drive a compressor that raises the pressure of the induction air." },
      { t: "Supercharger", d: "An engine-driven air pump that compresses the induction air. It raises the manifold pressure and forces the mixture into the cylinders." },
      { t: "Vapor lock", d: "Air or fuel vapour in the fuel line stops the fuel flow. It can follow a dry tank or very hot fuel in an injected engine." },
      { t: "FADEC", d: "Full Authority Digital Engine Control. It samples each cylinder and sets the fuel-air ratio at each firing, so no mixture control is needed." },
      { t: "Why attach a static line before self-fueling?", d: "To bond the aircraft to the fuel source and prevent a static spark." },
      { t: "Sudden drop in oil pressure", d: "It signals imminent engine damage. Land as soon as practical." }
    ]
  },
  {
    id: "instruments",
    code: "05",
    name: "Instruments & Pitot-Static",
    blurb: "What each needle reads, and how each one lies to you.",
    cards: [
      { t: "Which instruments use the static port only?", d: "The altimeter and the vertical speed indicator." },
      { t: "Which instrument uses ram air?", d: "The airspeed indicator. It compares ram pressure from the pitot tube against static pressure." },
      { t: "Indicated airspeed", d: "What you read on the face of the airspeed indicator." },
      { t: "Calibrated airspeed", d: "Indicated airspeed corrected for installation and instrument error." },
      { t: "True airspeed", d: "Calibrated airspeed corrected for altitude and non-standard temperature." },
      { t: "Ground speed", d: "True airspeed corrected for wind. The actual speed across the ground." },
      { t: "Blocked pitot tube with the drain hole open", d: "The airspeed indicator drops to zero, because it senses no difference between ram and static pressure." },
      { t: "Blocked pitot tube and drain hole, static port clear", d: "The airspeed indicator acts as an altimeter. It reads higher as you climb and lower as you descend." },
      { t: "Blocked static port", d: "The altimeter freezes at the blockage altitude, the VSI reads zero, and the airspeed indicator becomes inaccurate." },
      { t: "Blocked static: which way does the airspeed error go?", d: "Above the blockage altitude it reads slow. Below the blockage altitude it reads fast." },
      { t: "Alternate static source indications", d: "The altimeter reads slightly high, the airspeed reads slightly high, and the VSI shows a momentary climb." },
      { t: "Altimeter setting above 18,000 ft MSL", d: "Set 29.92 inches of mercury." },
      { t: "High to low, look out below", d: "If you fly from high pressure or high temperature into low, the altimeter reads higher than your true altitude." },
      { t: "Which instruments are vacuum driven?", d: "The attitude indicator and the heading indicator on a conventional panel." },
      { t: "Which gyro instrument is usually electric?", d: "The turn coordinator. It gives an attitude cross-check if the vacuum pump fails." },
      { t: "Standard rate turn", d: "3 degrees per second, so a full 360-degree turn takes 2 minutes." },
      { t: "ANDS", d: "Accelerate North, Decelerate South. The magnetic compass error during a speed change on an easterly or westerly heading." },
      { t: "UNOS", d: "Undershoot North, Overshoot South. The magnetic compass lead and lag error during a turn." },
      { t: "Squawk 7500", d: "Hijack." },
      { t: "Squawk 7600", d: "Lost communications." },
      { t: "Squawk 7700", d: "Emergency." },
      { t: "Pressure altitude", d: "The altitude read when you set the altimeter to 29.92 inches of mercury." },
      { t: "Density altitude", d: "Pressure altitude corrected for non-standard temperature. It is the altitude the airplane thinks it is flying at." }
    ]
  },
  {
    id: "weather",
    code: "06",
    name: "Meteorology",
    blurb: "Lapse rates, fog, fronts, and the clouds you must avoid.",
    cards: [
      { t: "Standard day", d: "15 degrees C and 29.92 inches of mercury at sea level, with a lapse rate of 2 degrees C per 1,000 ft." },
      { t: "Dry adiabatic lapse rate", d: "3 degrees C per 1,000 ft. The dewpoint lapses about 0.5 degrees C per 1,000 ft." },
      { t: "Moist adiabatic lapse rate", d: "2 degrees C per 1,000 ft." },
      { t: "Cloud base rule of thumb", d: "Divide the temperature and dewpoint spread by 2.5, then multiply by 1,000 ft." },
      { t: "Dewpoint", d: "The temperature to which the air must cool to become saturated. A small spread means fog or low cloud is likely." },
      { t: "Radiation fog", d: "It forms in moist air over low flat ground on a clear, calm night. It needs stable air and high pressure. Wind destroys it." },
      { t: "Advection fog", d: "Warm, moist air moves over a cooler surface. It is common along coastlines and it needs wind to form." },
      { t: "Upslope fog", d: "Moist, stable air is forced up a sloping land mass. It needs wind to form." },
      { t: "Steam fog", d: "Cold, dry air moves over warmer water. The droplets can freeze quickly and cause low-level icing." },
      { t: "Ice pellets at the surface", d: "They indicate a temperature inversion with freezing rain at a higher altitude. Do not climb." },
      { t: "Temperature inversion", d: "The temperature increases with altitude. It brings stable, smooth air with poor visibility, haze, fog, and low cloud below it." },
      { t: "Front", d: "The boundary between two air masses." },
      { t: "How do you know a front has passed?", d: "The temperature changes and the wind changes." },
      { t: "Cold front", d: "Cold air displaces warm air. Thunderstorms form along the front. Visibility becomes good after it passes." },
      { t: "Warm front", d: "Warm air replaces cold air. It brings light to moderate rain and drizzle. Visibility stays poor, with haze after it passes." },
      { t: "Occluded front", d: "A cold front overtakes a warm front. It brings the worst of both: turbulence, showers or steady rain, and poor visibility." },
      { t: "Stationary front", d: "Neither air mass moves. It affects a large geographic area for a long time." },
      { t: "Cumulus cloud", d: "A flat base with a dome-shaped top. It shows a shallow layer of instability. Expect turbulence but little icing." },
      { t: "Towering cumulus", d: "Billowing cauliflower tops that show a deep unstable layer. Expect heavy turbulence and icing. It can become a thunderstorm." },
      { t: "Cumulonimbus", d: "Grey-white to black, full of moisture, very unstable. It is a thunderstorm and it holds the greatest turbulence." },
      { t: "Thunderstorm stages", d: "Cumulus, with continuous updrafts. Mature, when rain reaches the surface and updrafts and downdrafts exist together. Dissipating, with downdrafts." },
      { t: "Polar air mass", d: "Cold and dry." },
      { t: "Maritime tropical air mass", d: "Warm and moist." },
      { t: "What does structural icing need?", d: "Visible moisture and an aircraft surface temperature at or below freezing." },
      { t: "Worst icing hazard", d: "Freezing rain. It runs back over the airframe and freezes as clear ice." },
      { t: "What drives the big weather picture?", d: "The sun, heat exchange, and the Coriolis effect, plus surface friction below about 2,000 ft AGL." }
    ]
  },
  {
    id: "human",
    code: "07",
    name: "Aeromedical & Decision Making",
    blurb: "The pilot is a system too. Know its failure modes.",
    cards: [
      { t: "IMSAFE", d: "Illness, Medication, Stress, Alcohol, Fatigue, Emotion. Use it to decide if you are fit for this flight." },
      { t: "PAVE", d: "Pilot in command, Aircraft, enVironment, External pressures. Use it to sort the risks during preflight planning." },
      { t: "The five Ps", d: "The Plan, the Plane, the Pilot, the Passengers, the Programming. Review them at preflight, takeoff, cruise, descent, and final." },
      { t: "The 3P model", d: "Perceive the circumstances, Process their effect on safety, Perform the best course of action." },
      { t: "Hypoxic hypoxia", d: "Not enough oxygen is available. It comes from the low partial pressure of oxygen at altitude." },
      { t: "Hypemic hypoxia", d: "The blood cannot carry the oxygen to the cells. Carbon monoxide poisoning is the classic cause." },
      { t: "Stagnant hypoxia", d: "Oxygen-rich blood does not reach the tissue. Excessive G loading causes it." },
      { t: "Histotoxic hypoxia", d: "The cells cannot use the oxygen. Alcohol and drugs cause it." },
      { t: "Alcohol and physiological altitude", d: "One ounce of alcohol raises your physiological altitude by about 2,000 ft." },
      { t: "Hypoxia symptoms", d: "Euphoria, impaired judgment, decreased reaction time, drowsiness, headache, tingling fingers, and cyanosis in the lips and nails." },
      { t: "Why is hypoxia dangerous?", d: "It is insidious. The symptoms are hard to recognise before your judgment is already affected." },
      { t: "Hypoxia remedy", d: "Use supplemental oxygen or descend to a lower altitude." },
      { t: "Hyperventilation", d: "You breathe too fast and lose too much carbon dioxide. Slow the breathing rate, talk aloud, or breathe into a bag." },
      { t: "Carbon monoxide symptoms", d: "Headache, blurred vision, dizziness, drowsiness, and loss of muscle power." },
      { t: "Action for suspected carbon monoxide", d: "Turn off the heater, open the fresh air vents and windows, use supplemental oxygen, and land." },
      { t: "Spatial disorientation", d: "The brain receives conflicting messages from the senses. Trust the flight instruments and do not fly by feel." },
      { t: "Coriolis illusion", d: "An abrupt head movement during a constant-rate turn. It creates a powerful sense of rotation on another axis." },
      { t: "Somatogravic illusion", d: "Rapid acceleration during takeoff feels like a nose-up pitch. Pushing the nose down in response is the hazard." },
      { t: "Inversion illusion", d: "An abrupt change from a climb to level flight feels like tumbling backward." },
      { t: "False horizon", d: "Ground lights, stars, or a sloping cloud layer at night are mistaken for the true horizon." },
      { t: "Autokinesis", d: "A single static light stared at in the dark appears to move." },
      { t: "Night vision technique", d: "Use off-centre viewing, because the centre of the eye has a night blind spot. Allow about 30 minutes to adapt to the dark." },
      { t: "Smoking and altitude", d: "Carbon monoxide in the blood raises the physiological altitude. Three cigarettes are worth about 8,000 ft." },
      { t: "Five hazardous attitudes", d: "Anti-authority, Impulsivity, Invulnerability, Macho, Resignation." },
      { t: "Antidote to anti-authority", d: "Follow the rules. They are usually right." },
      { t: "Antidote to impulsivity", d: "Not so fast. Think first." },
      { t: "Antidote to invulnerability", d: "It could happen to me." },
      { t: "Antidote to macho", d: "Taking chances is foolish." },
      { t: "Antidote to resignation", d: "I am not helpless. I can make a difference." },
      { t: "Ear block relief", d: "Yawn, swallow, tense the throat muscles, or pinch the nostrils and exert pressure. This is the Valsalva maneuver." },
      { t: "Action for a sick passenger", d: "Open the air vents, loosen clothing, offer supplemental oxygen, and keep their eyes on a point outside. Avoid head movement and land soon." }
    ]
  },
  {
    id: "airport",
    code: "08",
    name: "Airport Operations & Lighting",
    blurb: "Patterns, paint, and the colour of every light you will see.",
    cards: [
      { t: "VASI, red over white", d: "You are on the glidepath. Red over white, you are all right." },
      { t: "VASI, white over white", d: "You are high. High as a kite." },
      { t: "VASI, red over red", d: "You are low. Red over red, you are dead." },
      { t: "PAPI", d: "Precision Approach Path Indicator. One horizontal row of four lights, used at larger airports." },
      { t: "VASI obstruction clearance", d: "It gives obstruction clearance within 10 degrees of the extended centreline out to 4 nautical miles from the threshold." },
      { t: "Segmented circle", d: "A ground structure around the wind indicator that shows the traffic pattern direction. The short leg of the L shows the turn direction." },
      { t: "Windsock", d: "It shows wind direction, speed, and gusts. Full inflation means about 15 knots." },
      { t: "Traffic pattern entry", d: "Enter at a 45-degree angle to the downwind leg, aimed at a point abeam the midpoint of the runway, at pattern altitude." },
      { t: "Downwind leg", d: "Parallel to the runway, opposite the landing direction, half a mile to one mile out, at pattern altitude." },
      { t: "When do you turn base?", d: "Continue past the point abeam the approach end until the threshold is about 45 degrees behind you, then make a medium-bank turn." },
      { t: "Runway edge lights", d: "White, and yellow for the last 2,000 ft of an instrument runway to mark the caution zone." },
      { t: "Runway centreline lights", d: "White until 3,000 ft remain, alternating red and white until 1,000 ft remain, then all red." },
      { t: "Taxiway lights", d: "Blue edge lights and green centreline lights." },
      { t: "Threshold lights", d: "Green when seen from the approach, red when seen from the runway." },
      { t: "REIL", d: "Runway End Identifier Lights. A pair of flashing lights that identify the approach end of a runway." },
      { t: "Lost communications procedure", d: "Squawk 7600, circle the airport to see the traffic flow, enter the pattern, and watch the tower for light gun signals." },
      { t: "How do you acknowledge a light gun signal?", d: "Rock your wings in the day or flash the landing light at night." },
      { t: "Steady green in flight", d: "Cleared to land." },
      { t: "Flashing green in flight", d: "Return for landing. A steady green will follow." },
      { t: "Steady red in flight", d: "Give way to other aircraft and continue circling." },
      { t: "Flashing red in flight", d: "The airport is unsafe. Do not land." },
      { t: "Alternating red and green", d: "General warning. Use extreme caution." },
      { t: "Steady green on the ground", d: "Cleared for takeoff." },
      { t: "Flashing green on the ground", d: "Cleared to taxi." },
      { t: "Flashing red on the ground", d: "Taxi clear of the runway in use." },
      { t: "Flashing white on the ground", d: "Return to the starting point on the airport." },
      { t: "Night, for logging flight time", d: "From the end of evening civil twilight to the beginning of morning civil twilight." },
      { t: "Night, for passenger currency", d: "From 1 hour after sunset to 1 hour before sunrise." },
      { t: "When are position lights required?", d: "From sunset to sunrise." }
    ]
  },
  {
    id: "aero",
    code: "09",
    name: "Aerodynamics, Loads & Stability",
    blurb: "Why the wing works, and what breaks it.",
    cards: [
      { t: "The four forces", d: "Lift, weight, thrust, and drag." },
      { t: "Angle of attack", d: "The angle between the chord line and the relative wind. The wing always stalls at the same critical angle of attack." },
      { t: "Load factor in a 30-degree level turn", d: "About 1.15 G." },
      { t: "Load factor in a 45-degree level turn", d: "About 1.41 G." },
      { t: "Load factor in a 60-degree level turn", d: "2.0 G." },
      { t: "How does bank affect stall speed?", d: "The stall speed increases with the square root of the load factor. At 60 degrees of bank it is 1.41 times the level stall speed." },
      { t: "Normal category limit load factors", d: "Positive 3.8 G and negative 1.52 G." },
      { t: "Utility category limit load factors", d: "Positive 4.4 G and negative 1.76 G." },
      { t: "Aerobatic category limit load factors", d: "Positive 6.0 G and negative 3.0 G." },
      { t: "Why does maneuvering speed matter?", d: "Below VA the wing stalls before the load becomes destructive. Above VA abrupt control input or strong turbulence can exceed the limit load." },
      { t: "Flutter", d: "A self-feeding vibration where aerodynamic force couples with the natural vibration of the structure. It can destroy a surface at high speed." },
      { t: "Longitudinal stability", d: "Stability about the lateral axis, which is pitch. The centre of gravity position and the horizontal stabiliser control it." },
      { t: "Lateral stability", d: "Stability about the longitudinal axis, which is roll. Dihedral, sweepback, and wing position control it." },
      { t: "Directional stability", d: "Stability about the vertical axis, which is yaw. The vertical stabiliser controls it, like the feathers on an arrow." },
      { t: "Forward centre of gravity", d: "It gives more stability but a higher stall speed, a longer takeoff run, and heavier elevator forces." },
      { t: "Aft centre of gravity", d: "It gives less stability and makes stall and spin recovery difficult. It is the more dangerous limit to exceed." },
      { t: "Left-turning tendencies", d: "Torque, P-factor, spiralling slipstream, and gyroscopic precession." },
      { t: "P-factor", d: "At a high angle of attack the descending propeller blade takes a bigger bite of air, so the thrust line moves right and the nose yaws left." },
      { t: "Ground effect", d: "Within about one wingspan of the surface, the induced drag decreases. The airplane may float on landing or lift off before it can climb." },
      { t: "Adverse yaw", d: "The down aileron makes more induced drag than the up aileron, so the nose yaws away from the turn. Use rudder to coordinate." },
      { t: "Induced drag", d: "Drag created by the production of lift. It is greatest at low airspeed and high angle of attack." },
      { t: "Parasite drag", d: "Drag from the form, skin friction, and interference of the airframe. It increases with the square of the airspeed." },
      { t: "L over D max", d: "The angle of attack where lift over drag is greatest. It gives the best glide range." },
      { t: "Wake turbulence", d: "Wingtip vortices from an aircraft that is generating lift. They are worst when the aircraft is heavy, clean, and slow." },
      { t: "How do you avoid wake turbulence on landing?", d: "Stay above the heavy aircraft's flight path and land beyond its touchdown point." },
      { t: "Thrust and power in a climb", d: "Excess thrust sets the climb angle. Excess power sets the climb rate." }
    ]
  }
];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const clip = (s, n) => s.length > n ? s.slice(0, n - 1).trimEnd() + "\u2026" : s;
function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}
const A0 = 135;
const SWEEP = 270;
const at = (f) => A0 + f * SWEEP;
function Dial({ value, size = 168, label = "MASTERY" }) {
  const cx = 100, cy = 100;
  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const f = i / 20;
    const major = i % 4 === 0;
    const [x1, y1] = polar(cx, cy, major ? 68 : 74, at(f));
    const [x2, y2] = polar(cx, cy, 80, at(f));
    ticks.push(/* @__PURE__ */ React.createElement("line", { key: i, x1, y1, x2, y2, className: major ? "tk-maj" : "tk-min" }));
  }
  const needle = at(Math.max(0, Math.min(1, value)));
  const [nx, ny] = polar(cx, cy, 66, needle);
  const [tx, ty] = polar(cx, cy, -14, needle);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200", width: size, height: size, className: "dial", role: "img", "aria-label": `${label} ${Math.round(value * 100)} percent` }, /* @__PURE__ */ React.createElement("circle", { cx, cy, r: 92, className: "dial-face" }), /* @__PURE__ */ React.createElement("circle", { cx, cy, r: 86, className: "dial-ring" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(cx, cy, 58, at(0.05), at(0.35)), className: "arc-white" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(cx, cy, 72, at(0.16), at(0.75)), className: "arc-green" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(cx, cy, 72, at(0.75), at(0.94)), className: "arc-yellow" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(cx, cy, 72, at(0.94), at(0.985)), className: "arc-red" }), ticks, /* @__PURE__ */ React.createElement("line", { x1: tx, y1: ty, x2: nx, y2: ny, className: "needle" }), /* @__PURE__ */ React.createElement("circle", { cx, cy, r: 9, className: "hub" }), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 44, textAnchor: "middle", className: "dial-num" }, Math.round(value * 100)), /* @__PURE__ */ React.createElement("text", { x: cx, y: cy + 60, textAnchor: "middle", className: "dial-lbl" }, label));
}
function PreflightDeck() {
  const [deckId, setDeckId] = useState(null);
  const [mode, setMode] = useState("cards");
  const [status, setStatus] = useState({});
  const deck = DECKS.find((d) => d.id === deckId) || null;
  const deckScore = useCallback(
    (d) => {
      const known = d.cards.filter((_, i) => status[`${d.id}:${i}`] === "known").length;
      return { known, total: d.cards.length, frac: known / d.cards.length };
    },
    [status]
  );
  const overall = useMemo(() => {
    const total = DECKS.reduce((n, d) => n + d.cards.length, 0);
    const known = Object.values(status).filter((v) => v === "known").length;
    return { known, total, frac: total ? known / total : 0 };
  }, [status]);
  const mark = (i, v) => setStatus((s) => {
    const key = `${deckId}:${i}`;
    const next = { ...s };
    if (next[key] === v) delete next[key];
    else next[key] = v;
    return next;
  });
  return /* @__PURE__ */ React.createElement("div", { className: "pd" }, /* @__PURE__ */ React.createElement(Styles, null), !deck ? /* @__PURE__ */ React.createElement(Home, { onPick: (id) => {
    setDeckId(id);
    setMode("cards");
  }, deckScore, overall }) : /* @__PURE__ */ React.createElement(
    Study,
    {
      deck,
      mode,
      setMode,
      onExit: () => setDeckId(null),
      status,
      mark,
      score: deckScore(deck)
    }
  ));
}
function Home({ onPick, deckScore, overall }) {
  return /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("header", { className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-txt" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Private pilot ground school \xB7 Part 61"), /* @__PURE__ */ React.createElement("h1", { className: "title" }, "Preflight", /* @__PURE__ */ React.createElement("span", { className: "title-2" }, "Deck")), /* @__PURE__ */ React.createElement("p", { className: "lede" }, "Nine decks built from your binder, the Airplane Flying Handbook, and the MIT ground school lectures. Flip them, drill them, race them, or write them out."), /* @__PURE__ */ React.createElement("div", { className: "tally" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, overall.total), " cards"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, DECKS.length), " decks"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, "4"), " study modes"))), /* @__PURE__ */ React.createElement("div", { className: "hero-dial" }, /* @__PURE__ */ React.createElement(Dial, { value: overall.frac, size: 200, label: "MASTERY" }))), /* @__PURE__ */ React.createElement("div", { className: "grid" }, DECKS.map((d) => {
    const s = deckScore(d);
    return /* @__PURE__ */ React.createElement("button", { key: d.id, className: "deck", onClick: () => onPick(d.id) }, /* @__PURE__ */ React.createElement("span", { className: "deck-code" }, d.code), /* @__PURE__ */ React.createElement("span", { className: "deck-name" }, d.name), /* @__PURE__ */ React.createElement("span", { className: "deck-blurb" }, d.blurb), /* @__PURE__ */ React.createElement("span", { className: "deck-foot" }, /* @__PURE__ */ React.createElement("span", { className: "bar" }, /* @__PURE__ */ React.createElement("i", { style: { width: `${s.frac * 100}%` } })), /* @__PURE__ */ React.createElement("span", { className: "deck-n" }, s.known, "/", s.total)));
  })), /* @__PURE__ */ React.createElement("p", { className: "foot" }, "Progress is held for this session only. Nothing is saved when you close the tab."));
}
const MODES = [
  { id: "cards", label: "Flashcards" },
  { id: "learn", label: "Learn" },
  { id: "match", label: "Match" },
  { id: "write", label: "Write" }
];
function Study({ deck, mode, setMode, onExit, status, mark, score }) {
  return /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "bar-top" }, /* @__PURE__ */ React.createElement("button", { className: "back", onClick: onExit }, "\u2190 All decks"), /* @__PURE__ */ React.createElement("div", { className: "bar-mid" }, /* @__PURE__ */ React.createElement("span", { className: "deck-code sm" }, deck.code), /* @__PURE__ */ React.createElement("h2", { className: "bar-title" }, deck.name)), /* @__PURE__ */ React.createElement("span", { className: "bar-score" }, score.known, "/", score.total, " known")), /* @__PURE__ */ React.createElement("nav", { className: "modes" }, MODES.map((m) => /* @__PURE__ */ React.createElement("button", { key: m.id, className: `mode ${mode === m.id ? "on" : ""}`, onClick: () => setMode(m.id) }, m.label))), mode === "cards" && /* @__PURE__ */ React.createElement(Flashcards, { deck, status, mark }), mode === "learn" && /* @__PURE__ */ React.createElement(Learn, { deck, mark }), mode === "match" && /* @__PURE__ */ React.createElement(Match, { deck }), mode === "write" && /* @__PURE__ */ React.createElement(Write, { deck, mark }));
}
function Flashcards({ deck, status, mark }) {
  const [order, setOrder] = useState(() => deck.cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    setOrder(deck.cards.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }, [deck.id]);
  const idx = order[pos];
  const card = deck.cards[idx];
  const st = status[`${deck.id}:${idx}`];
  const go = useCallback((n) => {
    setFlipped(false);
    setPos((p) => (p + n + order.length) % order.length);
  }, [order.length]);
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);
  return /* @__PURE__ */ React.createElement("div", { className: "pane" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `card ${flipped ? "flip" : ""}`,
      onClick: () => setFlipped((f) => !f),
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter") setFlipped((f) => !f);
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "card-in" }, /* @__PURE__ */ React.createElement("div", { className: "card-side front" }, /* @__PURE__ */ React.createElement("span", { className: "side-tag" }, "Front"), /* @__PURE__ */ React.createElement("p", { className: "card-term" }, card.t), /* @__PURE__ */ React.createElement("span", { className: "hint" }, "Click or press space to flip")), /* @__PURE__ */ React.createElement("div", { className: "card-side back" }, /* @__PURE__ */ React.createElement("span", { className: "side-tag" }, "Back"), /* @__PURE__ */ React.createElement("p", { className: "card-def" }, card.d)))
  ), /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("button", { className: "btn ghost", onClick: () => go(-1), "aria-label": "Previous card" }, "\u2190"), /* @__PURE__ */ React.createElement("span", { className: "counter" }, pos + 1, " ", /* @__PURE__ */ React.createElement("i", null, "/"), " ", order.length), /* @__PURE__ */ React.createElement("button", { className: "btn ghost", onClick: () => go(1), "aria-label": "Next card" }, "\u2192")), /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("button", { className: `btn mark rev ${st === "review" ? "on" : ""}`, onClick: () => mark(idx, "review") }, "Study again"), /* @__PURE__ */ React.createElement("button", { className: `btn mark kno ${st === "known" ? "on" : ""}`, onClick: () => {
    mark(idx, "known");
    go(1);
  } }, "I know it")), /* @__PURE__ */ React.createElement("div", { className: "row small" }, /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => {
    setOrder(shuffle(order));
    setPos(0);
    setFlipped(false);
  } }, "Shuffle"), /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => {
    setOrder(deck.cards.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  } }, "Reset order"), /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => {
    const left = deck.cards.map((_, i) => i).filter((i) => status[`${deck.id}:${i}`] !== "known");
    if (left.length) {
      setOrder(shuffle(left));
      setPos(0);
      setFlipped(false);
    }
  } }, "Only the ones I miss")));
}
function buildQuestion(deck, idx) {
  const wrong = shuffle(deck.cards.map((c, i) => i).filter((i) => i !== idx)).slice(0, 3);
  return shuffle([idx, ...wrong]);
}
function Learn({ deck, mark }) {
  const [queue, setQueue] = useState(() => shuffle(deck.cards.map((_, i) => i)));
  const [step, setStep] = useState(0);
  const [opts, setOpts] = useState(() => buildQuestion(deck, 0));
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [right, setRight] = useState(0);
  const [asked, setAsked] = useState(0);
  const reset = useCallback(() => {
    const q = shuffle(deck.cards.map((_, i) => i));
    setQueue(q);
    setStep(0);
    setOpts(buildQuestion(deck, q[0]));
    setPicked(null);
    setStreak(0);
    setRight(0);
    setAsked(0);
  }, [deck]);
  useEffect(() => {
    reset();
  }, [deck.id, reset]);
  const idx = queue[step % queue.length];
  const card = deck.cards[idx];
  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    setAsked((n) => n + 1);
    if (i === idx) {
      setRight((n) => n + 1);
      setStreak((n) => n + 1);
      if (streak + 1 >= 2) mark(idx, "known");
    } else {
      setStreak(0);
      mark(idx, "review");
      setQueue((q) => [...q, idx]);
    }
  };
  const next = () => {
    setPicked(null);
    const n = step + 1;
    setStep(n);
    setOpts(buildQuestion(deck, queue[n % queue.length]));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "pane" }, /* @__PURE__ */ React.createElement("div", { className: "learn-head" }, /* @__PURE__ */ React.createElement("span", { className: "prompt-tag" }, "Which answer fits?"), /* @__PURE__ */ React.createElement("span", { className: "streak" }, "Streak ", /* @__PURE__ */ React.createElement("b", null, streak), " \xB7 ", right, "/", asked)), /* @__PURE__ */ React.createElement("div", { className: "prompt" }, card.t), /* @__PURE__ */ React.createElement("div", { className: "opts" }, opts.map((i) => {
    const state = picked === null ? "" : i === idx ? "good" : i === picked ? "bad" : "dim";
    return /* @__PURE__ */ React.createElement("button", { key: i, className: `opt ${state}`, onClick: () => choose(i), disabled: picked !== null }, deck.cards[i].d);
  })), picked !== null && /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("button", { className: "btn solid", onClick: next }, "Next \u2192"), /* @__PURE__ */ React.createElement("button", { className: "link", onClick: reset }, "Restart deck")));
}
function Match({ deck }) {
  const SIZE = 6;
  const [round, setRound] = useState(0);
  const pick = useMemo(() => shuffle(deck.cards.map((_, i) => i)).slice(0, SIZE), [deck.id, round]);
  const leftCol = useMemo(() => shuffle(pick), [pick]);
  const rightCol = useMemo(() => shuffle(pick), [pick]);
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState([]);
  const [miss, setMiss] = useState(null);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(true);
  const timer = useRef(null);
  useEffect(() => {
    setSel(null);
    setDone([]);
    setMiss(null);
    setT(0);
    setRunning(true);
  }, [pick]);
  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => setT((x) => x + 1), 100);
    return () => clearInterval(timer.current);
  }, [running]);
  useEffect(() => {
    if (done.length === SIZE) setRunning(false);
  }, [done]);
  const tap = (side, i) => {
    if (done.includes(i)) return;
    if (sel === null) {
      setSel({ side, i });
      return;
    }
    if (sel.side === side) {
      setSel({ side, i });
      return;
    }
    if (sel.i === i) {
      setDone((d) => [...d, i]);
      setSel(null);
    } else {
      setMiss(i);
      setT((x) => x + 20);
      setTimeout(() => setMiss(null), 380);
      setSel(null);
    }
  };
  const cls = (side, i) => `tile ${done.includes(i) ? "gone" : ""} ${sel && sel.side === side && sel.i === i ? "sel" : ""} ${miss === i ? "miss" : ""}`;
  return /* @__PURE__ */ React.createElement("div", { className: "pane" }, /* @__PURE__ */ React.createElement("div", { className: "learn-head" }, /* @__PURE__ */ React.createElement("span", { className: "prompt-tag" }, "Tap a term, then its answer"), /* @__PURE__ */ React.createElement("span", { className: "clock" }, (t / 10).toFixed(1), "s")), done.length === SIZE ? /* @__PURE__ */ React.createElement("div", { className: "finish" }, /* @__PURE__ */ React.createElement(Dial, { value: 1, size: 140, label: "MATCHED" }), /* @__PURE__ */ React.createElement("p", { className: "finish-t" }, (t / 10).toFixed(1), " seconds"), /* @__PURE__ */ React.createElement("button", { className: "btn solid", onClick: () => setRound((r) => r + 1) }, "New round")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "match" }, /* @__PURE__ */ React.createElement("div", { className: "col" }, leftCol.map((i) => /* @__PURE__ */ React.createElement("button", { key: i, className: cls("L", i), onClick: () => tap("L", i) }, deck.cards[i].t))), /* @__PURE__ */ React.createElement("div", { className: "col" }, rightCol.map((i) => /* @__PURE__ */ React.createElement("button", { key: i, className: `${cls("R", i)} def`, onClick: () => tap("R", i) }, clip(deck.cards[i].d, 96))))), /* @__PURE__ */ React.createElement("div", { className: "row small" }, /* @__PURE__ */ React.createElement("span", { className: "note" }, "A wrong pair adds 2 seconds."), /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => setRound((r) => r + 1) }, "Skip round"))));
}
function Write({ deck, mark }) {
  const [queue, setQueue] = useState(() => shuffle(deck.cards.map((_, i) => i)));
  const [step, setStep] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    setQueue(shuffle(deck.cards.map((_, i) => i)));
    setStep(0);
    setVal("");
    setRes(null);
  }, [deck.id]);
  const idx = queue[step % queue.length];
  const card = deck.cards[idx];
  const check = () => {
    if (res) return;
    const a = norm(val), b = norm(card.d);
    let ok = a === b;
    if (!ok && a.length > 2 && b.includes(a)) ok = a.length / b.length > 0.5;
    if (!ok && a.length > 2 && a.includes(b)) ok = true;
    setRes(ok ? "good" : "bad");
    mark(idx, ok ? "known" : "review");
  };
  const next = () => {
    setRes(null);
    setVal("");
    setStep((s) => s + 1);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "pane" }, /* @__PURE__ */ React.createElement("div", { className: "learn-head" }, /* @__PURE__ */ React.createElement("span", { className: "prompt-tag" }, "Write the answer"), /* @__PURE__ */ React.createElement("span", { className: "streak" }, step % queue.length + 1, " / ", queue.length)), /* @__PURE__ */ React.createElement("div", { className: "prompt" }, card.t), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref: inputRef,
      className: `write ${res || ""}`,
      rows: 3,
      value: val,
      placeholder: "Type what you remember, then check it.",
      onChange: (e) => setVal(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          res ? next() : check();
        }
      },
      disabled: !!res
    }
  ), res && /* @__PURE__ */ React.createElement("div", { className: `reveal ${res}` }, /* @__PURE__ */ React.createElement("span", { className: "reveal-tag" }, res === "good" ? "That matches" : "The answer"), /* @__PURE__ */ React.createElement("p", null, card.d)), /* @__PURE__ */ React.createElement("div", { className: "row" }, !res ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "btn solid", onClick: check }, "Check"), /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => {
    setRes("bad");
    mark(idx, "review");
  } }, "Show the answer")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "btn solid", onClick: next }, "Next \u2192"), res === "bad" && /* @__PURE__ */ React.createElement("button", { className: "link", onClick: () => {
    mark(idx, "known");
    setRes("good");
  } }, "I had it right"))), /* @__PURE__ */ React.createElement("p", { className: "note" }, "Wording does not have to match exactly. Judge yourself honestly."));
}
function Styles() {
  return /* @__PURE__ */ React.createElement("style", null, `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.pd {
  --chart:#EEE6D4;
  --chart-2:#E3D8C0;
  --ink:#1B1A17;
  --ink-2:#5A554A;
  --magenta:#B32663;
  --blue:#2A5F9E;
  --green:#2C6E49;
  --amber:#C98A11;
  --red:#B23A26;
  --line:rgba(27,26,23,.16);
  --disp:'Barlow Condensed', 'Arial Narrow', sans-serif;
  --body:'IBM Plex Sans', system-ui, sans-serif;
  --mono:'IBM Plex Mono', ui-monospace, monospace;
  background:
    repeating-linear-gradient(0deg, rgba(27,26,23,.035) 0 1px, transparent 1px 34px),
    repeating-linear-gradient(90deg, rgba(27,26,23,.035) 0 1px, transparent 1px 34px),
    var(--chart);
  color:var(--ink);
  font-family:var(--body);
  min-height:100%;
  padding:28px 20px 56px;
}
.pd *{box-sizing:border-box}
.pd button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
.pd button:focus-visible,.pd textarea:focus-visible{outline:2px solid var(--magenta);outline-offset:2px}
.wrap{max-width:860px;margin:0 auto}

/* hero */
.hero{display:flex;gap:32px;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--line);padding-bottom:26px;margin-bottom:30px;flex-wrap:wrap}
.hero-txt{flex:1 1 340px;min-width:280px}
.eyebrow{font-family:var(--disp);text-transform:uppercase;letter-spacing:.18em;
  font-size:12px;font-weight:600;color:var(--magenta);margin:0 0 10px}
.title{font-family:var(--disp);font-weight:700;font-size:clamp(46px,9vw,78px);
  line-height:.86;letter-spacing:-.01em;margin:0;text-transform:uppercase}
.title-2{color:var(--blue);display:block}
.lede{font-size:15px;line-height:1.55;color:var(--ink-2);margin:16px 0 0;max-width:44ch}
.tally{display:flex;gap:20px;margin-top:18px;font-family:var(--mono);font-size:12px;color:var(--ink-2)}
.tally b{font-weight:600;color:var(--ink)}
.hero-dial{flex:0 0 auto;margin-inline:auto}

/* dial */
.dial-face{fill:rgba(255,255,255,.55);stroke:var(--line);stroke-width:1}
.dial-ring{fill:none;stroke:var(--ink);stroke-width:2;opacity:.75}
.arc-white{fill:none;stroke:#FFFFFF;stroke-width:7;stroke-linecap:butt}
.arc-green{fill:none;stroke:var(--green);stroke-width:7}
.arc-yellow{fill:none;stroke:var(--amber);stroke-width:7}
.arc-red{fill:none;stroke:var(--red);stroke-width:7}
.tk-maj{stroke:var(--ink);stroke-width:2}
.tk-min{stroke:var(--ink);stroke-width:1;opacity:.45}
.needle{stroke:var(--magenta);stroke-width:3.4;stroke-linecap:round;
  transition:all .5s cubic-bezier(.34,1.4,.5,1)}
.hub{fill:var(--ink)}
.dial-num{font-family:var(--disp);font-weight:700;font-size:30px;fill:var(--ink)}
.dial-lbl{font-family:var(--disp);font-size:10px;letter-spacing:.2em;fill:var(--ink-2)}

/* deck grid */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.deck{text-align:left;background:rgba(255,255,255,.6);border:1px solid var(--line);
  border-radius:2px;padding:16px 16px 13px;display:flex;flex-direction:column;gap:6px;
  transition:transform .16s ease,box-shadow .16s ease,border-color .16s}
.deck:hover{transform:translateY(-2px);border-color:var(--ink);box-shadow:4px 4px 0 rgba(27,26,23,.1)}
.deck-code{font-family:var(--mono);font-size:11px;color:var(--magenta);letter-spacing:.1em}
.deck-code.sm{font-size:11px}
.deck-name{font-family:var(--disp);font-size:22px;font-weight:600;line-height:1.05;text-transform:uppercase}
.deck-blurb{font-size:13px;color:var(--ink-2);line-height:1.4;flex:1}
.deck-foot{display:flex;align-items:center;gap:10px;margin-top:8px}
.bar{flex:1;height:3px;background:rgba(27,26,23,.14);position:relative;overflow:hidden}
.bar i{position:absolute;inset:0 auto 0 0;background:var(--green);transition:width .4s ease}
.deck-n{font-family:var(--mono);font-size:11px;color:var(--ink-2)}
.foot{margin-top:26px;font-size:12px;color:var(--ink-2);font-family:var(--mono)}

/* study shell */
.bar-top{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;
  border-bottom:1px solid var(--line);padding-bottom:14px}
.back{font-family:var(--disp);text-transform:uppercase;letter-spacing:.1em;font-size:13px;font-weight:600}
.back:hover{color:var(--magenta)}
.bar-mid{display:flex;align-items:baseline;gap:10px}
.bar-title{font-family:var(--disp);font-size:26px;font-weight:600;margin:0;text-transform:uppercase;line-height:1}
.bar-score{font-family:var(--mono);font-size:12px;color:var(--ink-2)}
.modes{display:flex;gap:4px;margin:16px 0 22px;flex-wrap:wrap}
.mode{font-family:var(--disp);text-transform:uppercase;letter-spacing:.1em;font-size:13px;font-weight:600;
  padding:7px 14px;border:1px solid var(--line);border-radius:2px;background:rgba(255,255,255,.4)}
.mode:hover{border-color:var(--ink)}
.mode.on{background:var(--ink);color:var(--chart);border-color:var(--ink)}
.pane{display:flex;flex-direction:column;gap:16px}

/* flashcard */
.card{perspective:1600px;height:290px;cursor:pointer}
.card-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;
  transition:transform .5s cubic-bezier(.4,.1,.2,1)}
.card.flip .card-in{transform:rotateX(180deg)}
.card-side{position:absolute;inset:0;backface-visibility:hidden;border:1px solid var(--ink);
  border-radius:2px;padding:30px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;background:#FBF7EC;box-shadow:5px 5px 0 rgba(27,26,23,.12)}
.card-side.back{transform:rotateX(180deg);background:#1B1A17;color:#F2ECDC;border-color:#1B1A17}
.side-tag{position:absolute;top:12px;left:14px;font-family:var(--mono);font-size:10px;
  letter-spacing:.14em;text-transform:uppercase;opacity:.5}
.card-term{font-family:var(--disp);font-size:clamp(30px,6vw,46px);font-weight:600;line-height:1.05;margin:0;text-transform:uppercase}
.card-def{font-size:clamp(15px,2.4vw,19px);line-height:1.5;margin:0;max-width:46ch}
.hint{position:absolute;bottom:14px;font-family:var(--mono);font-size:10.5px;color:var(--ink-2);letter-spacing:.06em}

.row{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.row.small{gap:18px;margin-top:2px}
.counter{font-family:var(--mono);font-size:14px;min-width:74px;text-align:center}
.counter i{opacity:.4;font-style:normal}
.btn{font-family:var(--disp);text-transform:uppercase;letter-spacing:.09em;font-size:14px;
  font-weight:600;padding:10px 20px;border:1px solid var(--ink);border-radius:2px;transition:.14s}
.btn.ghost{padding:8px 16px;background:rgba(255,255,255,.5)}
.btn.ghost:hover{background:var(--ink);color:var(--chart)}
.btn.solid{background:var(--ink);color:var(--chart)}
.btn.solid:hover{background:var(--magenta);border-color:var(--magenta)}
.btn.mark{background:rgba(255,255,255,.5)}
.btn.mark.rev:hover,.btn.mark.rev.on{background:var(--amber);border-color:var(--amber);color:#221B06}
.btn.mark.kno:hover,.btn.mark.kno.on{background:var(--green);border-color:var(--green);color:#F1F6F2}
.link{font-family:var(--mono);font-size:12px;color:var(--ink-2);border-bottom:1px solid var(--line);padding-bottom:1px}
.link:hover{color:var(--magenta);border-color:var(--magenta)}
.note{font-family:var(--mono);font-size:11.5px;color:var(--ink-2);text-align:center}

/* learn + write */
.learn-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.prompt-tag{font-family:var(--disp);text-transform:uppercase;letter-spacing:.16em;font-size:12px;
  font-weight:600;color:var(--magenta)}
.streak,.clock{font-family:var(--mono);font-size:12px;color:var(--ink-2)}
.clock{font-size:15px;color:var(--ink)}
.prompt{font-family:var(--disp);font-size:clamp(26px,5vw,40px);font-weight:600;line-height:1.08;
  text-transform:uppercase;border-left:3px solid var(--magenta);padding-left:16px}
.opts{display:grid;gap:9px}
.opt{text-align:left;font-size:14.5px;line-height:1.45;padding:14px 16px;border:1px solid var(--line);
  border-radius:2px;background:rgba(255,255,255,.55);transition:.14s}
.opt:hover:not(:disabled){border-color:var(--ink);background:#FFF}
.opt.good{border-color:var(--green);background:rgba(44,110,73,.12);box-shadow:inset 3px 0 0 var(--green)}
.opt.bad{border-color:var(--red);background:rgba(178,58,38,.1);box-shadow:inset 3px 0 0 var(--red)}
.opt.dim{opacity:.4}
.write{width:100%;font-family:var(--body);font-size:15px;line-height:1.5;padding:14px 16px;
  border:1px solid var(--ink);border-radius:2px;background:#FBF7EC;resize:vertical;color:var(--ink)}
.write.good{border-color:var(--green)}
.write.bad{border-color:var(--red)}
.reveal{border:1px solid var(--line);border-left:3px solid var(--ink);padding:13px 16px;background:rgba(255,255,255,.55)}
.reveal.good{border-left-color:var(--green)}
.reveal.bad{border-left-color:var(--red)}
.reveal-tag{font-family:var(--disp);text-transform:uppercase;letter-spacing:.14em;font-size:11px;
  font-weight:600;color:var(--ink-2)}
.reveal p{margin:5px 0 0;font-size:15px;line-height:1.5}

/* match */
.match{display:grid;grid-template-columns:1fr 1.35fr;gap:10px}
.col{display:flex;flex-direction:column;gap:9px}
.tile{text-align:left;border:1px solid var(--line);border-radius:2px;background:rgba(255,255,255,.6);
  padding:13px 14px;font-family:var(--disp);font-size:19px;font-weight:600;text-transform:uppercase;
  line-height:1.12;flex:1;transition:.14s}
.tile.def{font-family:var(--body);font-size:13.5px;font-weight:400;text-transform:none;line-height:1.4}
.tile:hover{border-color:var(--ink)}
.tile.sel{border-color:var(--magenta);background:rgba(179,38,99,.1);box-shadow:inset 3px 0 0 var(--magenta)}
.tile.miss{border-color:var(--red);background:rgba(178,58,38,.12);animation:shake .34s}
.tile.gone{opacity:0;pointer-events:none}
@keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.finish{display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 0}
.finish-t{font-family:var(--disp);font-size:34px;font-weight:600;margin:0}

@media (max-width:620px){
  .match{grid-template-columns:1fr}
  .card{height:250px}
  .hero{gap:18px}
}
@media (prefers-reduced-motion:reduce){
  .pd *{animation:none!important;transition:none!important}
}
    `);
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(PreflightDeck, null));
document.getElementById("__loading").remove();
