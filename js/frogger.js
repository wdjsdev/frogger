window.onload = function()
{
	/*

		Canvas Settings

	*/
	var myCanvas = document.getElementById("myCanvas");

	var ctx = myCanvas.getContext("2d");

	ctx.canvas.height = 550;
	ctx.canvas.width = 550;

	var height = myCanvas.height;
	var width = myCanvas.width;


	/*

		Event Listeners

	*/
	
		document.addEventListener("keydown", keyDown, false);
		function keyDown(e)
		{
			//right key
			if(e.keyCode == 39)
			{
				frog.move(grid,0);
				e.preventDefault();
			}
			
			//left key
			else if(e.keyCode == 37)
			{
				frog.move(-grid,0);
				e.preventDefault();
			}
			
			//up key
			else if(e.keyCode == 38)
			{
				frog.move(0,-grid);
				e.preventDefault();
			}
			
			//down key
			else if(e.keyCode == 40)
			{
				frog.move(0,grid);
				e.preventDefault();
			}

		}


	/*

		Global Variable Definitions

	*/

	var gamePlay;
	var frog;
	var cars = [];
	var logs = [];
	var grid = 50;
	var safeZones = [];
	var completedSections = [];
	var completedColor = "#f4427a";

	var lives = 3;
	var timer = 60;

	//car speeds
	var superFast = 7;
	var fast = 3;
	var med = 2;
	var slow = 1;	


	function init()
	{
		frog = new Frog(width/2 - grid/2,height-grid,grid,grid);
		frog.draw();

		makeSafeZones();
		


		makeCars();
		makeLogs();

		gamePlay = setInterval(gameLoop, 1000/30);
	}

	function makeSafeZones()
	{
		safeZones.push(new ColorBlock(0, height - grid, width, grid, "gray"));
		safeZones.push(new ColorBlock(0, height - grid*6, width, grid, "gray"));
		safeZones.push(new ColorBlock(0, 0, width, grid, "gray"));
	}

	function makeCars()
	{
		var row1 = height - grid * 2;

		for(var c = 0; c < 4; c++)
		{
			cars.push(new MovingObject((grid * 3) * c,row1,grid,grid,-med,"blue"));
		}

		var row2 = height - grid * 3;
		for(var c = 0; c< 2; c++)
		{
			cars.push(new MovingObject((grid * 6) * c, row2, grid*3, grid, fast, "yellow"));
		}

		var row3 = height - grid * 4;
		cars.push(new MovingObject(-grid,row3,grid,grid,superFast,"red"));

		var row4 = height - grid * 5;
		for(var c=0;c< 2;c++)
		{
			cars.push(new MovingObject((grid * 8)*c, row4, grid * 4, grid, med, "purple"));
		}
	}


	function makeLogs()
	{
		var row5 = height - grid * 7;
		for(var l=0;l<2;l++)
		{
			logs.push(new MovingObject(grid * l * 5, row5, grid * 3, grid, med, "#8c5104"));
		}

		var row6 = height - grid * 8;
		for(var l=0;l<3;l++)
		{
			logs.push(new MovingObject(grid * l * 5, row6, grid * 3, grid, -med, "#593f0e"));
		}

		var row7 = height - grid * 9;
		for(var l=0;l<5;l++)
		{
			logs.push(new MovingObject(grid * l * 3, row7, grid, grid, med, "#225128"));
		}

		var row8 = height - grid * 10;
		for(var l=0;l<2;l++)
		{
			logs.push(new MovingObject(grid * l * 6, row8, grid * 5, grid, slow*1.2, "#67754c"));
		}

	}



	/*

		Constructor Functions

	*/

	function Frog(x,y,w,h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = "green";
		this.bind = undefined;

		this.draw = function()
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}
		this.update = function()
		{
			if(this.intersectsCar())
			{
				resetGame(true);
			}

			if(this.inWater())
			{
				this.bind = this.intersectsLog()
				if(this.bind && this.x >= -3 && this.x + this.w <= width +3)
				{
					this.x += this.bind.speed;
				}
				else if(!this.bind)
				{
					resetGame(true);
				}
			}

			this.topRow();

			this.draw();
		}
		this.move = function(moveX,moveY)
		{
			if((this.x > 0 && moveX < 0) || (this.x < width - grid && moveX >0))
			{
				this.x += moveX;
			}
			if((this.y > 0 && moveY < 0) || (this.y < height - grid && moveY > 0))
			{
				this.y += moveY;
			}
		}

		this.intersectsCar = function()
		{
			var squashed = false;

			for(var i=cars.length-1;i>=0 && !squashed;i--)
			{
				var obj = cars[i];
				if(intersect(this,obj))
				{
					console.log("squashed");
					squashed = true;
				}
			}
			return squashed;
		}

		this.inWater = function()
		{
			if(this.y >= grid && this.y < grid *5)
				return true;
			else
				return false;
		}

		this.intersectsLog = function()
		{
			var result;
			for(var i=logs.length-1;i>=0 && !result;i--)
			{
				var obj = logs[i];
				if(intersect(this,obj))
				{
					result = obj;
				}
			}
			return result;
		}

		this.topRow = function()
		{
			if(this.y == 0)
			{	
				var csx;
				//get the nearest grid location
				if(this.x % grid <= grid/2)
				{
					csx = this.x - this.x % grid;
				}
				else
				{
					csx = this.x + grid - this.x % grid;
				}
				completedSections.push(new ColorBlock(csx,0,grid,grid,completedColor));
				resetGame(false);
			}
		}

	}

	function intersect(frog,obj)
	{
		var result = false;
		
		if(frog.y == obj.y && ((frog.x > obj.x && frog.x < (obj.x + obj.w)) || (frog.x + frog.w > obj.x && frog.x + frog.w < obj.x + obj.w)))
		{
			result = true;
		}
		
		return result;
	}

	function MovingObject(x,y,w,h,s,c)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.speed = s;
		this.color = c;


		this.draw = function()
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}		

		this.move = function()
		{
			//item is moving left and is off the canvas
			if(this.x + this.w < -grid && this.speed < 0)
			{
				this.x = width + grid;
			}
			//item is moving right and is off the canvas
			else if(this.x - this.w > width + grid && this.speed > 0)
			{
				this.x = -this.w;
			}
			//item is moving, and is still in the middle of the canvas
			else
			{
				this.x += this.speed;
			}
		}

		this.update = function()
		{
			this.move();
			this.draw();
		}


	}

	function ColorBlock(x,y,w,h,c)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = c;

		this.draw = function()
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.w,this.h);
		}	
	}



	/*

		Animation functions

	*/

	function clearCanvas()
	{
		ctx.clearRect(0,grid,width,grid*4);
		ctx.clearRect(0,grid*6, width, grid * 4);
	}

	function resetGame(loseLife)
	{
		if(loseLife)
		{
			lives--;
			updateSpeed(.9);
			if(lives < 1)
			{
				alert("LOSER!");
				clearInterval(gamePlay);
			}
		}
		frog.y = height - grid;
		frog.x = width/2 - grid/2;
		updateSpeed(1.1);

	}

	function updateSpeed(amt)
	{
		//loop the cars and increase their speed
		for(var x=0;x<cars.length;x++)
		{
			cars[x].speed *= amt;
		}
		//loop the logs and increase their speed
		for(var x=0;x<logs.length;x++)
		{
			logs[x].speed *= amt;
		}
	}

	function gameLoop()
	{
		clearCanvas();

		//update safeZones
		for(var sz=0;sz<safeZones.length;sz++)
		{
			safeZones[sz].draw();
		}

		//update cars
		for(var c = 0;c<cars.length;c++)
		{
			cars[c].update();
		}

		//update logs
		for(var l = 0; l<logs.length;l++)
		{
			logs[l].update();
		}

		//update completed sections
		for(var cs=0;cs<completedSections.length;cs++)
		{
			completedSections[cs].draw();
		}

		//finally, update the frot
		frog.update();
	}


	//initialize the game
	init();

}