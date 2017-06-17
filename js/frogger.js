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

	//car speeds
	var superFast = 20;
	var fast = 5;
	var med = 4;
	var slow = 3;	


	function init()
	{
		frog = new Frog(width/2 - grid/2,height-grid,grid,grid);
		frog.draw();

		makeSafeZones();
		


		makeCars();
		makeLogs();

		gamePlay = setInterval(gameLoop, 100);
	}

	function makeSafeZones()
	{
		safeZones.push(new SafeZone(0, height - grid, width, grid, "gray"));
		safeZones.push(new SafeZone(0, height - grid*6, width, grid, "gray"));
		safeZones.push(new SafeZone(0, 0, width, grid, "gray"));
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
			cars.push(new MovingObject((grid * 8)*c, row4, grid * 4, grid, slow, "purple"));
		}
	}


	function makeLogs()
	{
		var row5 = height - grid * 7;
		for(var l=0;l<2;l++)
		{
			logs.push(new MovingObject(grid * l * 5, row5, grid * 3, grid, med, "brown"));
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

		this.draw = function()
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.w,this.h);
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
			if(this.x < -grid && this.speed < 0)
			{
				this.x = width + grid;
			}
			else if(this.x > width + grid && this.speed > 0)
			{
				this.x = -this.w;
			}
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

	function SafeZone(x,y,w,h,c)
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
		ctx.clearRect(0,0,width,height);
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
		frog.draw();
	}


	//initialize the game
	init();

}