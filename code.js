import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from './sources/addons/PointerLock.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace; 

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById('game-container');
if (container) 
{
  container.appendChild(renderer.domElement);
}
else 
{
  document.body.appendChild(renderer.domElement);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111116);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 25;

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 2, -10);

const floor_material = new THREE.MeshStandardMaterial({ 
    color: 0x808080, 
    side: THREE.DoubleSide
});

class Walls
{
  constructor()
  {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.id = g_id++;
    this.geometry = 0;
    this.mesh = 0;
    walls[this.id] = this;
  }
}

const mouse_control = new PointerLockControls(camera, document.body);
const floor_geometry = new THREE.PlaneGeometry(80.5, 80.5, 1, 1);
const floor = new THREE.Mesh(floor_geometry, floor_material);
const cube_geometry = new THREE.BoxGeometry(1,1,1);
const cube_material = new THREE.MeshStandardMaterial({ color: 0x000000});
const arm_geometry = new THREE.BoxGeometry(0.2, 0.2, 1.5);
const arm_material = new THREE.MeshStandardMaterial({ color: 0xffdbac});
const arm_mesh = new THREE.Mesh(arm_geometry, arm_material);
const arm2_mesh = new THREE.Mesh(arm_geometry, arm_material);
const smer_pohybu = new THREE.Vector3();
const jdu_v_bok = new THREE.Vector3();

//upload all sounds
const zvuk_buchu = new Audio('./sources/sounds/buch_sound.wav');
const footstep1 = new Audio('./sources/sounds/footstep1.wav');
const footsteps_running = new Audio('./sources/sounds/footsteps_running.wav');
footstep1.volume = 0.45;

let speed = 0.05;
let in_game = 0;
let W_key = 0;
let S_key = 0;
let A_key = 0;
let D_key = 0;
let Shift_key = 0;
let jump = 0;
let crouch = 0;
let sel_jsem_nikam = 0;
let buch = 0;
let floor_gravitation = 0;
let now_gravitation = 0;
let arm_position = 1;
let buch_arm = 0;
let HP = 100;
let last_HP = HP;
let g_id = 0;
let fall = 0;
let last_jump_x = 0;
let last_jump_y = 0;
let random_footstep = 0;
const max_HP = 100;
let walls = {};
let world_plan = [];

arm2_mesh.position.set(-0.4, -0.7, -0.9);
camera.add(arm2_mesh);
arm_mesh.position.set(0.3, -0.5, -0.8);
camera.add(arm_mesh);
scene.add(camera);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);

document.addEventListener('click', () => { 
  if (in_game == 1 && buch == 0)
  {
    if (W_key == 1 )
    {
      sel_jsem_nikam = 1;
    }
    if (S_key == 1 )
    {
      sel_jsem_nikam = 2;
    }
    if (A_key == 1 )
    {
      sel_jsem_nikam = 3;
    }
    if (D_key == 1 )
    {
      sel_jsem_nikam = 4;
    }
    W_key = 0;
    S_key = 0;
    A_key = 0;
    D_key = 0;
    buch = 1;
  }
});

if (in_game == 0)
{
  map_g_rooms(Math.floor(Math.random() * 76) , Math.floor(Math.random() * 76))
  map_g_rooms(Math.floor(Math.random() * 76) , Math.floor(Math.random() * 76))
  map_g_rooms(Math.floor(Math.random() * 76) , Math.floor(Math.random() * 76))
}

document.addEventListener('click', () => { 
  mouse_control.lock();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .catch((err) => {
        console.log(`Chyba při zapínání Fullscreenu: ${err.message}`);
      });
  in_game = 1;
  return;
  }
});

mouse_control.addEventListener('lock', () => { in_game = 1; });
mouse_control.addEventListener('unlock', () => { in_game = 0; });

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && (event.code === 'KeyW' || event.code === 'ArrowUp')) 
  {
    event.preventDefault();
    W_key = 1;
  }
  if (event.code === 'Space')
  {
    event.preventDefault();
  }
  if (in_game == 1 && buch == 0) 
  {
    if (event.code === 'KeyW' || event.code === 'ArrowUp')
    {
      W_key = 1;
    }
    if (event.code === 'KeyS' || event.code === 'ArrowDown')
    {
      S_key = 1;
    }
    if (event.code === 'KeyA' || event.code === 'ArrowLeft')
    {
      A_key = 1;
    }
    if (event.code === 'KeyD' || event.code === 'ArrowRight')
    {
      D_key = 1;
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight')
    {
      Shift_key = 1;
    }
    if (event.code === 'Space' && jump == 0)
    {
      jump = 1;
      last_jump_x = camera.position.x;
      last_jump_y = camera.position.y;
    }
    if (event.code ==='KeyX')
    {
      crouch = 1;
    }
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code === 'KeyW' || event.code === 'ArrowUp')
  {
    W_key = 0;
    if (Shift_key == 1)
    {
      footsteps_running.pause();
      footsteps_running.currentTime = 0;
    }
  }
  if (event.code === 'KeyS' || event.code === 'ArrowDown')
  {
    S_key = 0;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft')
  {  
    A_key = 0;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight')
  {
    D_key = 0;
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight')
  {
    Shift_key = 0;
    footsteps_running.pause();
    footsteps_running.currentTime = 0;
  }
  if (event.code === 'KeyX' && crouch == 1)
  {
    crouch = 0;
  }
});

function animate() 
{
  requestAnimationFrame(animate);

  if (last_HP != HP)
  {
    update_HP(HP);
  }

  if (in_game == 1)
  {
    let stojim_na_zdi = 0;

    for (let cube of Object.values(walls))
    {
      if (
        camera.position.x >= cube.mesh.position.x - 0.52 &&
        camera.position.x <= cube.mesh.position.x + 0.52 &&
        camera.position.z >= cube.mesh.position.z - 0.52 &&
        camera.position.z <= cube.mesh.position.z + 0.52
      )
      {
        if (cube.y == 0.5)
        {
          stojim_na_zdi = 1;
        }
        else if (cube.y == 1)
        {
          camera.position.x = last_jump_x;
          camera.position.y = last_jump_y;
        }
      }
    }

    if (stojim_na_zdi == 1)
    {
      floor_gravitation = 2;
    }
    else
    {
      floor_gravitation = 0;
    }
  }

  // SKÁKÁNÍ
  if (jump == 1)
  {
    now_gravitation += 0.13;
    jump = 2;
  }
  else if (jump == 2)
  {
    now_gravitation += 0.13;
    jump = 3;
  }
  else if (jump == 3)
  {
    now_gravitation += 0.13;
    jump = 4;
  }
  else if (jump == 4)
  {
    now_gravitation += 0.13;
    jump = 5;
  }
  else if (jump == 5)
  {
    now_gravitation += 0.13;
    jump = 6;
  }
  else if (jump == 6)
  {
    now_gravitation += 0.13;
    jump = 7;
  }
  else if (jump == 7)
  {
    now_gravitation += 0.13;
    jump = 8;
  }
  else if (jump == 8)
  {
    now_gravitation += 0.13;
    jump = 9;
  }
  else if (jump == 9)
  {
    now_gravitation += 0.13;
    jump = 10;
  }
  else if (jump == 10)
  {
    now_gravitation += 0.13;
    jump = 11;
  }
  else if (jump == 11)
  {
    if (now_gravitation > floor_gravitation)
    {
      now_gravitation -= 0.10;

      if (now_gravitation <= floor_gravitation)
      {
        jump = 0;
      }
    }
  }

  // POHYB HRÁČE
  if (in_game == 1) 
  {
    if (crouch == 1)
    {
      speed = 0.025;
    }
    else
    {
      speed = 0.05;
    }

    if (Shift_key === 1 && W_key === 1 && crouch == 0) 
    {
      speed = 0.15;
    }

    camera.getWorldDirection(smer_pohybu);

    smer_pohybu.y = 0;
    smer_pohybu.normalize();

    jdu_v_bok.set(-smer_pohybu.z, 0, smer_pohybu.x);
    jdu_v_bok.normalize();

    let se_pohybuje = false;

    // W
    if (W_key === 1)
    {
      move_player(
        smer_pohybu.x * speed,
        smer_pohybu.z * speed
      );

      se_pohybuje = true;

      if (Shift_key == 0)
      {
        footstep1.play();
      }
      else
      {
        footsteps_running.play();
      }
    }

    // S
    if (S_key === 1) 
    {
      move_player(
        -smer_pohybu.x * speed,
        -smer_pohybu.z * speed
      );

      se_pohybuje = true;

      if (Shift_key == 0)
      {
        footstep1.play();
      }
      else if (crouch == 0)
      {
        footsteps_running.play();
      }
    }

    // D
    if (D_key === 1) 
    {
      move_player(
        jdu_v_bok.x * speed,
        jdu_v_bok.z * speed
      );

      se_pohybuje = true;

      if (Shift_key == 0)
      {
        footstep1.play();
      }
      else
      {
        footsteps_running.play();
      }
    }

    // A
    if (A_key === 1) 
    {
      move_player(
        -jdu_v_bok.x * speed,
        -jdu_v_bok.z * speed
      );

      se_pohybuje = true;

      if (Shift_key == 0)
      {
        footstep1.play();
      }
      else
      {
        footsteps_running.play();
      }
    }

    // ANIMACE POHYBU RUKOU
    if (se_pohybuje === true)
    {
      if (arm_position === 0) 
      {
        arm_position = 1;
      }
      else 
      {
        if (Shift_key == 0)
        {
          arm_position++;
        }
        else if (crouch == 0)
        {
          arm_position += 2;
        }
        else if (Shift_key == 1 && crouch == 1)
        {
          arm_position++;
        }
      }

      if (arm_position >= 60)
      {
        arm_position = 1;
      }
    }
    else
    {
      arm_position = 0;
    }
  }

  // POZICE RUKOU
  if (arm_position == 0)
  {
    if (buch == 0)
    {
      arm2_mesh.position.set(-0.4, -0.7, -0.9);
      arm_mesh.position.set(0.3, -0.5, -0.8);
    }
    else if (buch == 1)
    {
      buch_arm = Math.round(Math.random());

      if (buch_arm == 0)
      {
        arm2_mesh.position.set(-0.4, -0.7, -0.7);
        arm_mesh.position.set(0.3, -0.45, -1.2); 
      }
      else
      {
        arm2_mesh.position.set(-0.4, -0.45, -1.15);
        arm_mesh.position.set(0.3, -0.5, -0.6);
      }

      buch = 2;
      zvuk_buchu.play();
    }
  }
  else if (arm_position >= 1 && arm_position < 30)
  {
    arm2_mesh.position.set(-2, -5, -2);
    arm_mesh.position.set(0.3, -0.45, -0.8); 
  }
  else if (arm_position >= 30 && arm_position < 60)
  {
    arm2_mesh.position.set(-0.4, -0.45, -0.8);
    arm_mesh.position.set(-2, -5, -2);
  }

  if (crouch == 0)
  {
    camera.position.y = now_gravitation + 2;
  }
  else if (crouch == 1)
  {
    camera.position.y = now_gravitation + 1.25;
  }

  if (buch >= 2 && buch <= 50)
  {
    buch++;

    if (buch_arm == 0)
    {
      arm2_mesh.position.set(-0.4, -0.7, -0.7);
      arm_mesh.position.set(0.3, -0.45, -1.2); 
    }
    else
    {
      arm2_mesh.position.set(-0.4, -0.45, -1.15);
      arm_mesh.position.set(0.3, -0.5, -0.6);
    }
  }
  else if (buch > 50)
  {
    buch = 0;
  }

  if (now_gravitation > floor_gravitation && jump == 0 || jump == 20) 
  {
    now_gravitation -= 0.20;

    if (now_gravitation < floor_gravitation) 
    {
      now_gravitation = floor_gravitation;
    }

    if (jump == 0) 
    {
      jump = 20;
    }
  }

  if (jump == 20 && now_gravitation <= floor_gravitation) 
  {
    now_gravitation = floor_gravitation;
    jump = 0;
  }

  renderer.render(scene, camera);
}

animate();

function update_HP(noveHP)
{
    const aktualniHP = Math.max(0, Math.min(max_HP, noveHP));

    const hpText = document.getElementById('hp-text');
    const barFill = document.getElementById('hp-bar-fill');

    if (hpText)
    {
        hpText.innerText = aktualniHP;
    }

    if (barFill)
    {
        const procenta = (aktualniHP / max_HP) * 100;

        barFill.style.width = procenta + '%';

        barFill.style.background = procenta < 30
            ? 'linear-gradient(90deg, #ff9900, #ff3300)'
            : 'linear-gradient(90deg, #ff4d4d, #cc0000)';
    }

    last_HP = aktualniHP;
}

function made_walls()
{
  for (let cell_x = -40; cell_x <= 40; cell_x += 1)
  {
    for (let cell_z = -40; cell_z <= 40; cell_z += 1)
    {
      const wall_YES_OR_NO = Math.round(Math.random() * 10);
      if (cell_x > -6 && cell_x  < 6)
      {
        if (cell_z > -6 && cell_z < 6)
        {
          continue;
        }
      }
      if (wall_YES_OR_NO == 3)
      {
        let cube = new Walls();
        cube.x = cell_x;
        cube.z = cell_z; 
        cube.geometry = new THREE.BoxGeometry(1,1,1);
        cube.y = 0.5
        cube.mesh =  new THREE.Mesh(cube.geometry, cube_material);
        cube.mesh.position.set(cube.x, cube.y, cube.z);
        scene.add(cube.mesh);
      }
    }
  }
  for (let cube of Object.values(walls))
  {
    world_plan[(cube.z + 40)*80 + cube.x + 40] = 1;
  }
  for (let i = 0;i < 100;i++)
  {
    if (shortest_path(0,0,30,20))
    {
      console.log("1");
    }
    else
    {
      console.log("0");
    }
  }
}

function shortest_path(start_x,start_z,target_x,target_z)
{
  let checked = [];
  checked[(start_z + 40) * 80 + start_x + 40] = 1;

  let stack = [[start_z + 40,start_x + 40]];
  let finded = 0;

  while (stack.length)
  {
    let check = stack.pop();

    if (check[0] == target_z + 40 && check[1] == target_x + 40)
    {
      finded = 1;
      break;
    }

    if (check[1] - 1 > -1)
    {
      const pos = check[0]*80 + (check[1] - 1);

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0],check[1] - 1]);
      }
    }
    if (check[1] + 1 < 81)
    {
      const pos = check[0]*80 + (check[1] + 1);

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0],check[1] + 1]);
      }
    }
    if (check[0] - 1 > -1)
    {
      const pos = (check[0] - 1)*80 + check[1];

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0] - 1,check[1]]);
      }
    }
    if (check[0] + 1 < 81)
    {
      const pos = (check[0] + 1)*80 + check[1];

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0] + 1,check[1]]);
      }
    }

    checked[check[0] * 80 + check[1]] = 1;
  }

  return finded;
}

function map_g_rooms(x, z) 
{  
  let length_of_room = Math.floor(Math.random() * 11) + 10;
  let width_of_room = Math.floor(Math.random() * 11) + 10;
  if (x + length_of_room > 40) 
  {
    length_of_room = 40 - x;
  }
  if (z + width_of_room > 40) 
  {
    width_of_room = 40 - z;
  }
  if (length_of_room < 2 || width_of_room < 2) return;  
  function create_wall_cube(wall_x, wall_z,wall_y) 
  {
    let cube = new Walls();
    cube.x = wall_x;
    cube.z = wall_z; 
    cube.y = wall_y;
    cube.geometry = new THREE.BoxGeometry(1, 1, 1);
    cube.mesh = new THREE.Mesh(cube.geometry, cube_material);
    cube.mesh.position.set(cube.x, cube.y, cube.z);
    scene.add(cube.mesh);
  }

  for (let i = 0; i <= length_of_room; i++) 
  {
    create_wall_cube(x + i, z,0.5);
    create_wall_cube(x + i, z + width_of_room,0.5);
    create_wall_cube(x + i, z,1.5);
    create_wall_cube(x + i, z + width_of_room,1.5);
    create_wall_cube(x + i, z,2.5);
    create_wall_cube(x + i, z + width_of_room,2.5);    
    create_wall_cube(x + i, z,3.5);
    create_wall_cube(x + i, z + width_of_room,3.5);
  }

  for (let j = 1; j < width_of_room; j++) 
  {
    create_wall_cube(x, z + j,0.5);
    create_wall_cube(x + length_of_room, z + j,0.5);
    create_wall_cube(x, z + j,1.5);
    create_wall_cube(x + length_of_room, z + j,1.5);
    create_wall_cube(x, z + j,2.5);
    create_wall_cube(x + length_of_room, z + j,2.5);
    create_wall_cube(x, z + j,3.5);
    create_wall_cube(x + length_of_room, z + j,3.5);
  }
}

function collision(x, z)
{
  for (let cube of Object.values(walls))
  {
    let wall_x = cube.mesh.position.x;
    let wall_z = cube.mesh.position.z;

    if (
      Math.abs(x - wall_x) < 0.8 &&
      Math.abs(z - wall_z) < 0.8
    )
    {
      return true;
    }
  }

  return false;
}

function move_player(dx, dz)
{
  let next_x = camera.position.x + dx;

  if (!collision(next_x, camera.position.z))
  {
    camera.position.x = next_x;
  }

  let next_z = camera.position.z + dz;

  if (!collision(camera.position.x, next_z))
  {
    camera.position.z = next_z;
  }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

