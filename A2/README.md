Project Introduction

This project is a 2D design game developed in VS Code using p5.js, combining basic shooting gameplay, level systems, and a simple narrative structure. Players will control a spaceship, defeat monsters in different levels, trigger hidden levels and complete the ultimate victory.

This game is designed with the core concept of being user-friendly for beginners. Its code structure is clear and the logic is intuitive, making it suitable as a 2D game project assignment in programming courses.

Gameplay Overview
Basic operations

W/A/S/D: Controls the up, down, left and right movement of the spaceship

Space bar: Fire bullets (one bullet per click)

Left mouse button: Click to switch story pages/Enter levels

Game Structures and Processes Game States

The game controls the flow through the gamestate variable, and the overall sequence is as follows:

Start the Story Pages

After the game starts, players will see three pages of story background pictures in sequence

Each time you click the mouse, you go to the next page




Level 1 / play1

Player health points: 5

Basic ammunition quantity: 8

Objective: Defeat 30 monsters

Mid Story Page

It is used to connect the plot and the transition between levels




Level 2 / play2

Player health points: 7

Basic ammunition quantity: 8

Objective: Defeat 50 monsters

It includes a hidden level entrance

Hidden Boss Level (Boss Fight)

Triggered when the player enters the hidden area

The Boss needs to be hit 50 times to defeat

After success, AI partners will be unlocked

Settlement and Victory Page Win

A victory screen will be displayed after the player completes all the goals

Core System Description
1.Ammunition and Loading System (Ammo & Reload)

The initial ammunition quantity for players is 8 rounds

Each press of the space bar consumes 1 bullet

When the ammunition quantity is 0:

The player enters the loading state

The filling time is 5 seconds

No shooting is allowed during loading

Monsters will continue to generate

After loading is completed, the ammunition will automatically be restored to 8 rounds

This system uses millis() to implement time detection, avoiding the use of complex timers and is suitable for beginners to understand.

2.Monster System

Monsters will be generated from the top of the screen and move down

If the monster touches the player or reaches the bottom of the screen:

The player's health points decrease

Monster reset position

In the second level, the monsters will increase their left and right movement, raising the difficulty

3.Hidden levels and Boss system

There is a hidden entrance at the lower right corner of the second level

After reaching the designated area, players enter the Boss level

The Boss needs to be hit by bullets 50 times

After defeating the Boss:

The player returns to the second level

Unlock the AI spaceship companion

4.AI Companion System

The AI spaceship will appear in the second level

AI will not stop players

The AI can be in the same position as the player and shoot simultaneously

The AI will move automatically and fire bullets regularly to assist players in completing levels

5.UI interface information display

In the level, the upper left corner of the screen will display in real time:

Current Score

Player Lives

The number of monsters defeated (Kills)

Ammunition quantity or loading status (Ammo/Reloading)

Technical implementation description

Use the p5.js framework

Use setup() and draw() as the main loop structure

Manage Bullets using an array

Manage the game flow using a State Machine

Use millis() to control the filling time

The code as a whole follows

The variable naming is clear

The function has a single responsibility.

The logical structure is linear and easy to read

Project features and design concepts

Combine narrative with Gameplay

Reward players' exploration behaviors with hidden levels

The difficulty gradually increases as the levels progress

Implement the complete game flow while keeping the code simple