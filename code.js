import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from './sources/addons/PointerLock.js';
import * as BufferGeometryUtils from './sources/utils/BufferGeometryUtils.js';

const size_of_map = 80;
const half_of_map = size_of_map / 2;
const border_min = (size_of_map / 2) - size_of_map;
const border_max = size_of_map / 2;
const fpsNadpis = document.getElementById("FPS_show");

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
scene.background = new THREE.Color(0x87ceeb);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const texture_loader = new THREE.TextureLoader();
const wood_house_wall_texture = texture_loader.load('./sources/images/wood_house_wall_texture(1)(1).png');
const door_wood_house_wall_texture = texture_loader.load('./sources/images/wood_house_wall_texture.png');
const floor_texture = texture_loader.load('./sources/images/floor_texture.png');
const down_block_door_texture = texture_loader.load('./sources/images/wood_door_block_down.png');
const roof_up_block = texture_loader.load('./sources/images/roof_up_texture.png');
const roof_down_block = texture_loader.load('./sources/images/roof_down_texture.png');
const door_blok = texture_loader.load('./sources/images/wooden_door.png');
const door_uzky_blok = texture_loader.load('./sources/images/wooden_door_other_side.png');
const slepice_noha = texture_loader.load('./sources/images/chicken_leg.png');
const slepice_telo = texture_loader.load('./sources/images/body_chicken.png');
const slepice_hlava = texture_loader.load('./sources/images/head_chicken.png');
const kohout_hreben = texture_loader.load('./sources/images/rooster_vole.png');
const villager_arm = texture_loader.load('./sources/images/villager_arm.png');
const villager_body = texture_loader.load('./sources/images/villager_body.png');
const villager_neck = texture_loader.load('./sources/images/villager_neck.png');
const villager_leg = texture_loader.load('./sources/images/villager_leg.png');
const villager_face_tex = texture_loader.load('./sources/images/villager_head_face.png');
const villager_face2_tex = texture_loader.load('./sources/images/villager_head_face_2.png');
const villager_ear_tex = texture_loader.load('./sources/images/villager_head_ear.png');
const villager_ear2_tex = texture_loader.load('./sources/images/villager_head_ear.png');
const villager_hair_tex = texture_loader.load('./sources/images/villager_head_hair.png');
const villager_neck_tex = texture_loader.load('./sources/images/villager_head_neck.png');
const villager_down_tex = texture_loader.load('./sources/images/villager_head_down.png');
const bed_up = texture_loader.load('./sources/images/bed_pillow_blanket.png');
const bed_long_side = texture_loader.load('./sources/images/side_bed.png');
const bed_short_side = texture_loader.load('./sources/images/another_side_bed.png');

villager_ear2_tex.wrapS = THREE.RepeatWrapping;
villager_ear2_tex.repeat.x = -1;

bed_up.rotation = Math.PI / 2;
bed_up.center.set(0.5, 0.5);

floor_texture.wrapS = THREE.RepeatWrapping;
floor_texture.wrapT = THREE.RepeatWrapping;
floor_texture.repeat.set(size_of_map + (Math.round(Math.random() * 7) - 3), size_of_map + (Math.round(Math.random() * 7) - 3)); 

const door_block_material = new THREE.MeshStandardMaterial({ map: door_wood_house_wall_texture });
const door_block_down_material = new THREE.MeshStandardMaterial({ map: down_block_door_texture });
const roof_up_block_mat = new THREE.MeshStandardMaterial({map: roof_up_block});
const roof_down_block_mat = new THREE.MeshStandardMaterial({map: roof_down_block});
const door_material = new THREE.MeshStandardMaterial({map: door_blok});
const door_uzky_material = new THREE.MeshStandardMaterial({map: door_uzky_blok});
const wood_wall_material = new THREE.MeshStandardMaterial({ map: wood_house_wall_texture});
const villager_face_mat = new THREE.MeshStandardMaterial({ map: villager_face_tex});
const villager_face2_mat = new THREE.MeshStandardMaterial({ map: villager_face2_tex});
const villager_ear_mat = new THREE.MeshStandardMaterial({ map: villager_ear_tex});
const villager_ear2_mat = new THREE.MeshStandardMaterial({ map: villager_ear2_tex});
const villager_hair_mat = new THREE.MeshStandardMaterial({ map: villager_hair_tex});
const villager_neck_mat = new THREE.MeshStandardMaterial({ map: villager_neck_tex});
const villager_down_mat = new THREE.MeshStandardMaterial({ map: villager_down_tex});
const bed_pillow_mat = new THREE.MeshStandardMaterial({ map: bed_up});
const bed_long_side_mat = new THREE.MeshStandardMaterial({ map: bed_long_side});
const bed_short_side_mat = new THREE.MeshStandardMaterial({ map: bed_short_side});

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.left = -45;
directionalLight.shadow.camera.right = 45;
directionalLight.shadow.camera.top = 45;
directionalLight.shadow.camera.bottom = -45;

directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 150;

directionalLight.shadow.bias = -0.0005;

directionalLight.shadow.camera.updateProjectionMatrix();

scene.add(directionalLight);

renderer.shadowMap.enabled = false;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 2.3, -10);

const floor_material = new THREE.MeshStandardMaterial({ 
  map: floor_texture,/*{{{*/
});/*}}}*/

const door_block_materialy = [
  door_block_material,/*{{{*/
  door_block_material,
  door_block_material,
  door_block_down_material,
  door_block_material,
  door_block_material  
];/*}}}*/

const roof_block_materialy = [
  roof_up_block_mat,/*{{{*/
  roof_up_block_mat,
  roof_up_block_mat,
  roof_down_block_mat,
  roof_up_block_mat,
  roof_up_block_mat  
];/*}}}*/

const doors_block_materialy = [
  door_uzky_material,/*{{{*/
  door_uzky_material,
  door_uzky_material,
  door_uzky_material,
  door_material,
  door_material  
];/*}}}*/

const villager_head_material = [
  villager_ear_mat,/*{{{*/
  villager_ear2_mat,
  villager_hair_mat,
  villager_down_mat,
  villager_neck_mat,
  villager_face_mat,
];/*}}}*/

const bed_material = [
/*{{{*/
  bed_long_side_mat,
  bed_long_side_mat,
  bed_pillow_mat,
  ,
  bed_short_side_mat,
  bed_short_side_mat,
];/*}}}*/

class Walls
{/*{{{*/
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
}/*}}}*/

class Doors
{/*{{{*/
  constructor()
  {
    this.opening = 0;
    this.axis = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.id = g_id++;
    this.geometry = 0;
    this.mesh = 0;
    this.open = 0;
    doors[this.id] = this;
  }
}/*}}}*/

class Mods
{/*{{{*/
  constructor()
  {
    this.cil_x = 0;
    this.cil_z = 0;
    this.next_cil_x = 0;
    this.next_cil_z = 0;
    this.zmena = 0;
    this.type = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.speed = 0.05;
    this.angel = 0;
    this.wanted_angel = this.angel;
    this.rotation_angel = 0;
    this.angel_is_ok = 1;
    this.any_cil = 0;
    this.path = [];
    this.path_piece = 0;
    this.mesh = 0;
    this.mluvim = 0;
    this.id = g_id++;
    this.dialog = 0;
    this.max_dialog = 3;
    this.next_dialog = 0;
    this.type_of_dialog = Math.round(Math.random());
    this.last_dialog = 0;
    this.text_sprite = null;
    this.face_texture = 0;
    this.making_noise = 0;
    this.head_mesh = null;
    this.male_female = 0;
    mods[this.id] = this;
  } 

  move()
  {
    if (this.mluvim == 0)
    {
      if (this.any_cil == 0 && this.angel_is_ok == 1)
      {
        this.any_cil = 1;
        this.path = shortesh_path(
          this.x, this.z,
          this.cil_x,this.cil_z
        );

        if (this.path === 0) {
          this.any_cil = 0;
          return;
        }
        this.path_piece = 0;
        this.next_cil_z = this.path[this.path_piece][0];
        this.next_cil_x = this.path[this.path_piece][1];
      }
      else
      { 
        const xd = this.next_cil_x - this.x;
        const zd = this.next_cil_z - this.z;
        const d = Math.sqrt(xd*xd + zd*zd);
        if (this.angel_is_ok == 1)
        {

          this.wanted_angel = Math.atan2(xd, zd);

          if (this.type == "villager")
          {
              this.wanted_angel -= Math.PI / 2;
          }

          this.rotation_angel = this.wanted_angel - this.angel;
          
          if (this.rotation_angel < -Math.PI) this.rotation_angel += Math.PI * 2;
          if (this.rotation_angel > Math.PI) this.rotation_angel -= Math.PI * 2;
        }
        this.mesh.rotation.y = this.angel - (Math.PI / 2);
        
        if (Math.abs(this.wanted_angel - this.angel) > 0.1)
        {
          this.angel += this.rotation_angel / 100;
          this.angel = Math.atan2(Math.sin(this.angel), Math.cos(this.angel)); 

          if (Math.abs(this.wanted_angel - this.angel) > 0.1)
          {
            this.angel_is_ok = 0;
          }
          else
          {
            this.angel = this.wanted_angel;
            this.angel_is_ok = 1;
          }
        }
        else
        {
          this.angel = this.wanted_angel;
          this.angel_is_ok = 1;
        }
        if (this.angel_is_ok == 1 && d <= this.speed || d == 0)
        {
          this.x = this.next_cil_x;
          this.z = this.next_cil_z;
          this.path_piece++;
          if (this.path_piece >= this.path.length)
          {
              this.any_cil = 0;
              this.wanted_angel = this.angel;
              this.path = [];
              return;
          }
          this.next_cil_z = this.path[this.path_piece][0];
          this.next_cil_x = this.path[this.path_piece][1];
        }
        else if (this.angel_is_ok == 1)
        {
          const nove_x = this.x + xd/d * this.speed;
          const nove_z = this.z + zd/d * this.speed;

          const grid_x = Math.round(nove_x + 40);
          const grid_z = Math.round(nove_z + 40);

          const index = grid_z * size_of_map + grid_x;

          if (world_plan[index] !== 1)
          {
              this.x = nove_x;
              this.z = nove_z;
          }
          else
          {
              this.any_cil = 0;
              this.path = [];
          }
        }
        this.mesh.position.set(this.x, this.y, this.z);
      }
    }
  }

  speak()
  {
    if (this.mluvim == 1)
    {
      const dx = camera.position.x - this.x;
      const dz = camera.position.z - this.z;

      if (!this.rotate(dx, dz))
      {
        return;
      }

      if (this.next_dialog <= 109)
      {
        this.next_dialog++;
        if (this.next_dialog % 5 === 0 && this.dialog <= 3)
        {
          if (this.face_texture == 0)
          {
            this.head_mesh.material[5].map = villager_face2_mat.map;
            this.head_mesh.material[5].needsUpdate = true;
            this.face_texture = 1;
          }
          else
          {
            this.head_mesh.material[5].map = villager_face_mat.map;
            this.head_mesh.material[5].needsUpdate = true;
            this.face_texture = 0;
          }
        }
      }
      else
      {
        if (this.dialog > this.max_dialog)
        {
          if (this.text_sprite) {
            scene.remove(this.text_sprite);
            this.text_sprite = null;
          }
          this.dialog = 0;
          this.last_dialog = 0;
          this.mluvim = 0;
          mluvim = 0;
          this.next_dialog = 0;
          return;
        }
        else
        {
          this.dialog++;
          this.next_dialog = 0;
        }
      }

      if (this.last_dialog != this.dialog)
      {
        this.last_dialog = this.dialog;

        if (this.text_sprite) {
          scene.remove(this.text_sprite);
          this.text_sprite = null;
        }

        if (this.dialog == 1)
        {
          if (this.type_of_dialog == 0)
          {
            this.text_sprite = make_text("Co je?", this.x, this.y + 3.875, this.z);
          }
          else
          {
            this.text_sprite = make_text("Co potřebuješ?", this.x, this.y + 3.875, this.z);
          }
        }
        else if (this.dialog == 2)
        {
          if (this.type_of_dialog == 1)
          {
            this.text_sprite = make_text("Aha to jsi ty.", this.x, this.y + 3.875, this.z);
          }
          else
          {
            this.text_sprite = make_text("Nevidíš že mám práci.", this.x, this.y + 3.875, this.z);
          }
        }
        else if (this.dialog == 3)
        {
          if (this.type_of_dialog == 1)
          {
            this.text_sprite = make_text("Jdi pryč.", this.x, this.y + 3.875, this.z);
          }
          else
          {
            this.text_sprite = make_text("TÁHNI.", this.x, this.y + 3.875, this.z);
          }
        }
      }
    }
  }

  rotate(x, z)
  {
    this.wanted_angel = Math.atan2(x, z);

    if (this.type == "villager")
    {
        this.wanted_angel -= Math.PI / 2;
    }

    this.rotation_angel = this.wanted_angel - this.angel;

    if (this.rotation_angel < -Math.PI) this.rotation_angel += Math.PI * 2;
    if (this.rotation_angel > Math.PI) this.rotation_angel -= Math.PI * 2;
    
    if (Math.abs(this.rotation_angel) > 0.1)
    {
      this.angel += this.rotation_angel / 40;
      this.angel = Math.atan2(Math.sin(this.angel), Math.cos(this.angel)); 
      this.mesh.rotation.y = this.angel - (Math.PI / 2);
      return false;
    }
    else
    {
      this.angel = this.wanted_angel;
      this.mesh.rotation.y = this.angel - (Math.PI / 2);
      return true;
    }
  }

  sound()
  {
    if (this.type == "chicken")
    {
      let will_kokodak = Math.round(Math.random() * 60);
      if (will_kokodak == 23)
      {
        if (this.male_female == 1)
        {
          chicken_sound_1.play();
        }
        else
        {
          chicken_sound_2.play();
        }
      }
    }
  }
}/*}}}*/

class Piece
{/*{{{*/
  constructor()
  {
    this.id = g_id++;
    this.x;
    this.z;
    this.h;
    this.g;
    this.f;
    this.come_from_x;
    this.come_from_z;
    this.am_I_start = 0;
    pieces[this.id] = this;
  }
}/*}}}*/

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const mouse_control = new PointerLockControls(camera, document.body);
const floor_geometry = new THREE.PlaneGeometry(size_of_map, size_of_map, 1, 1);
const floor = new THREE.Mesh(floor_geometry, floor_material);
const cube_geometry = new THREE.BoxGeometry(1,1,1);
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
const wooden_door_open = new Audio('./sources/sounds/wooden_door_open.wav');
const wooden_door_close = new Audio('./sources/sounds/wooden_door_close.wav');
const chicken_sound_1 = new Audio('./sources/sounds/chicken_1_sound.wav');
const chicken_sound_2 = new Audio('./sources/sounds/chicken_2_sound.wav');
footstep1.volume = 0.40;
wooden_door_close.volume = 0.40;
wooden_door_open.volume = 0.40;

let speed = 0.05;
let in_game = 0;
let W_key = 0;
let S_key = 0;
let A_key = 0;
let D_key = 0;
let E_key = 0;
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
let cas_zmneny_noc_a_dne = 0;
let random_footstep = 0;
let frame_per_second = 0;
let mluvim = 0;
const max_HP = 100;
const barva_den = new THREE.Color(0x87ceeb);
const barva_noc = new THREE.Color(0x111122); 
let walls = {};
let doors = {};
let world_plan = [];
let mods = {};
let pieces = {};
let raycaster_all = [];
let villagers = {};

arm2_mesh.position.set(-0.4, -0.7, -0.9);
camera.add(arm2_mesh);
arm_mesh.position.set(0.3, -0.5, -0.8);
camera.add(arm_mesh);
scene.add(camera);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);

//calling important functions
setInterval(am_I_movign,20);
setInterval(show_FPS,1000);
setInterval(onPointerDown,120);

document.addEventListener('click', () => { 
  if (in_game == 1 && buch == 0 && mluvim == 0)/*{{{*/
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
});/*}}}*/

if (in_game == 0)
{/*{{{*/
  show_FPS();
  let number_of_rooms = Math.floor(Math.random() * 7) + 4;
  for (let i = 0;i < number_of_rooms;i++)
  {
    map_g_rooms(Math.floor(Math.random() * half_of_map + 1) - half_of_map / 2, Math.floor(Math.random() *  half_of_map + 1) - half_of_map / 2)
  }
  spawn_player();
  number_of_rooms = Math.floor(Math.random() * 7) + 4;
  for (let i = 0;i < number_of_rooms;i++)
  {
    spawn_mods("villager");
  }
  number_of_rooms = Math.floor(Math.random() * 7) + 4;
  for (let i = 0;i < number_of_rooms;i++)
  {
    spawn_mods("chicken");
  }

}/*}}}*/

document.addEventListener('click', () => { 
  mouse_control.lock();/*{{{*/
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .catch((err) => {
        console.log(`Chyba při zapínání Fullscreenu: ${err.message}`);
      });
  in_game = 1;
  return;
  }
});/*}}}*/

mouse_control.addEventListener('lock', () => { in_game = 1; });
mouse_control.addEventListener('unlock', () => { in_game = 0; });

window.addEventListener('keydown', (event) => {
  if (mluvim == 0)
  {
    if (event.ctrlKey && (event.code === 'KeyW' || event.code === 'ArrowUp')) /*{{{*/
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
        if (can_I_jump(camera.position.x,camera.position.z))
        {
          jump = 1;
          last_jump_x = camera.position.x;
          last_jump_y = camera.position.y;
        }
      }
      if (event.code ==='KeyX')
      {
        crouch = 1;
      }
      if (event.code == 'KeyE')
      {
        E_key = 1;
      }
    }
  }
});/*}}}*/

window.addEventListener('keyup', (event) => {
  if (event.code === 'KeyW' || event.code === 'ArrowUp')/*{{{*/
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
  if (event.code == 'KeyE')
  {
    E_key = 0;
  }
});/*}}}*/


function animate() 
{/*{{{*/
  requestAnimationFrame(animate);
  
  if (last_HP != HP)
  {
    update_HP(HP);
  }
  cas_zmneny_noc_a_dne += 0.0005;
  let faktor = (Math.sin(cas_zmneny_noc_a_dne) + 1) / 2; 
  scene.background.copy(barva_noc).lerp(barva_den, faktor);
  
  for (const id in mods)
  {
    const mob = mods[id];
    let vse_okk = 0;
    if (mob.any_cil == 0)
    {
      let will_I_come = Math.floor(Math.random() * 35);
      if (will_I_come == 6)
      {
        let plus_x = 0;
        let plus_z = 0;
        let attemps = 0;
        for (let pokus = 0; pokus < 30; pokus++)
        {
            let plus_x = Math.floor(Math.random() * 7) - 3;
            let plus_z = Math.floor(Math.random() * 7) - 3;

            let next_x = mob.x + plus_x;
            let next_z = mob.z + plus_z;

            if (next_x < border_min|| next_x > border_max ||
            next_z < border_min || next_z > border_max)
            {
                continue;
            }

            let index = (next_z + half_of_map) * size_of_map + (next_x + half_of_map);

            if (world_plan[index] !== 1 || world_plan[index] !== 3)
            {
               mob.cil_x = next_x;
                mob.cil_z = next_z;
                vse_okk = 1;
                break;
            }
        }
      }

     if (vse_okk == 0)
      {
          mob.cil_x = mob.x;
          mob.cil_z = mob.z;
          mob.any_cil = 0;
      }
    }
    mob.move();
    mob.speak();
    if (mob.type == "chicken")
    {
      mob.sound();
    }
  }
  
  frame_per_second += 1;
  renderer.render(scene, camera);

  if (frame_per_second % 20 === 0)
  {
      console.log(
          "Draw calls:", renderer.info.render.calls,
          "Triangles:", renderer.info.render.triangles,
          "Geometries:", renderer.info.memory.geometries
      );
  }
}/*}}}*/

animate();

function update_HP(noveHP)
{/*{{{*/
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
}/*}}}*/

function any_path(start_x,start_z,target_x,target_z)
{/*{{{*/
  let checked = [];
  checked[(start_z + half_of_map) * size_of_map + start_x + half_of_map] = 1;

  let stack = [[start_z + half_of_map,start_x + half_of_map]];
  let finded = 0;

  while (stack.length)
  {
    let check = stack.pop();

    if (check[0] == target_z + half_of_map && check[1] == target_x + half_of_map)
    {
      finded = 1;
      break;
    }

    if (check[1] - 1 > -1)
    {
      const pos = check[0] * size_of_map + (check[1] - 1);

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0],check[1] - 1]);
      }
    }
    if (check[1] + 1 < size_of_map + 1)
    {
      const pos = check[0] * size_of_map + (check[1] + 1);

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0],check[1] + 1]);
      }
    }
    if (check[0] - 1 > -1)
    {
      const pos = (check[0] - 1) * size_of_map + check[1];

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0] - 1,check[1]]);
      }
    }
    if (check[0] + 1 < size_of_map + 1)
    {
      const pos = (check[0] + 1) * size_of_map + check[1];

      if (checked[pos] != 1 && world_plan[pos] != 1)
      {
        stack.push([check[0] + 1,check[1]]);
      }
    }

    checked[check[0] * size_of_map + check[1]] = 1;
  }

  return finded;
}/*}}}*/

function shortesh_path(start_x, start_z, target_x, target_z)
{/*{{{*/
    const SIZE = size_of_map;
    const CELLS = SIZE * SIZE;

    const startX = Math.round(start_x + half_of_map);
    const startZ = Math.round(start_z + half_of_map);
    const targetX = Math.round(target_x + half_of_map);
    const targetZ = Math.round(target_z + half_of_map);

    if (
        startX < 0 || startX >= SIZE ||
        startZ < 0 || startZ >= SIZE ||
        targetX < 0 || targetX >= SIZE ||
        targetZ < 0 || targetZ >= SIZE
    ) {
        return 0;
    }

    const start = startZ * SIZE + startX;
    const target = targetZ * SIZE + targetX;

    if (world_plan[target] == 1) return 0;

    const visited = new Uint8Array(CELLS);
    const parent = new Int32Array(CELLS);
    const queue = new Int32Array(CELLS);

    parent.fill(-1);

    let head = 0;
    let tail = 0;

    queue[tail++] = start;
    visited[start] = 1;

    const dx = [1, -1, 0, 0];
    const dz = [0, 0, 1, -1];

    while (head < tail)
    {
        const current = queue[head++];

        if (current === target) break;

        const x = current % SIZE;
        const z = Math.floor(current / SIZE);

        for (let i = 0; i < 4; i++)
        {
            const nx = x + dx[i];
            const nz = z + dz[i];

            if (
                nx < 0 || nx >= SIZE ||
                nz < 0 || nz >= SIZE
            ) continue;

            const next = nz * SIZE + nx;

            if (visited[next]) continue;
            if (world_plan[next] == 1) continue;

            visited[next] = 1;
            parent[next] = current;

            queue[tail++] = next;
        }
    }

    if (!visited[target]) return 0;

    const path = [];
    let current = target;

    while (current !== start)
    {
        if (current === -1) return 0;

        const z = Math.floor(current / SIZE);
        const x = current % SIZE;

        path.push([
            z - half_of_map,
            x - half_of_map
        ]);

        current = parent[current];
    }

    path.push([
        startZ - half_of_map,
        startX - half_of_map
    ]);

    path.reverse();

    return path;
}/*}}}*/

function map_g_rooms(x, z)
{/*{{{*/
  let length_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
  let width_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
  let attemps = 0;
  let wall_geometries = [];
  let roof_geometries = [];
  let dobl_geometries = [];
  let house = new THREE.Group();

  if(world_plan[(z + half_of_map) * size_of_map + x + half_of_map] == 1)
  {
    return;
  }

  let vse_ok = 0;
  while(vse_ok == 0)
  {  
    if (attemps >= 100)
    {
      return;
    }

    if (x + length_of_room >= half_of_map || z + width_of_room >= half_of_map) 
    {
      x = Math.floor(Math.random() * 41) - 20;
      z = Math.floor(Math.random() * 41) - 20;
      length_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
      width_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
      attemps++;
      continue;
    }

    let kolize = 0;
    
    for (let cx = x; cx <= x + length_of_room; cx++)
    {
      if (world_plan[(z + half_of_map) * size_of_map + (cx + half_of_map)] == 1 || 
          world_plan[(z + width_of_room + half_of_map) * size_of_map + (cx + half_of_map)] == 1)
      {
        kolize = 1;
        break;
      }
    }

    if (kolize == 0) {
      for (let cz = z; cz <= z + width_of_room; cz++)
      {
        if (world_plan[(cz + half_of_map) * size_of_map + (x + half_of_map)] == 1 || 
            world_plan[(cz + half_of_map) * size_of_map + (x + length_of_room + half_of_map)] == 1)
        {
          kolize = 1;
          break;
        }
      }
    }

    if (kolize == 1)
    {
      x = Math.floor(Math.random() * half_of_map + 1) - half_of_map;
      z = Math.floor(Math.random() * half_of_map + 1) - half_of_map;
      length_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
      width_of_room = Math.floor(Math.random() * half_of_map / 4 + 1) + 10;
      attemps++;
    }
    else
    {
      vse_ok = 1;
    }
  }

  function create_wall_cube(wall_x, wall_z, wall_y,door_axis) 
  {
    if (wall_y != 4)
    {
      let cube = new Walls();
      cube.x = wall_x;
      cube.z = wall_z; 
      if (wall_y == 2)
      {
        cube.y = 2;
        cube.geometry = new THREE.BoxGeometry(1, 4, 1);
        cube.geometry.translate(wall_x,2,wall_z)
        cube.mesh = new THREE.Group(cube.geometry,wood_wall_material);
        add_wall_part(cube.geometry,wood_wall_material);
      }
      else if (wall_y == 0)
      {
        cube.y = 3.2;
        cube.geometry = new THREE.BoxGeometry(1, 1.6, 1);
        cube.geometry.translate(wall_x,3.2,wall_z)
        cube.mesh = new THREE.Group(cube.geometry,door_block_materialy);
        add_wall_part(cube.geometry,door_block_materialy);
        create_wall_cube(cube.x, cube.z, 4,door_axis);
      }
      else if (wall_y == 5)
      {
        cube.y = 4.5;
        cube.geometry = new THREE.BoxGeometry(1, 1, 1);
        cube.geometry.translate(wall_x,4.5,wall_z)
        cube.mesh = new THREE.Group(cube.geometry,roof_block_materialy);
        add_wall_part(cube.geometry,roof_block_materialy);
      }
      else if (wall_y == 10)
      {
        cube.y = 0.5;
        cube.geometry = new THREE.BoxGeometry(1.5, 1, 3);
        cube.mesh = new THREE.Mesh(cube.geometry,bed_material);
        cube.mesh.position.set(cube.x + 0.25,cube.y,cube.z + 1);
        scene.add(cube.mesh);
      }

      if (wall_y != 5 && wall_y != 10) 
      {
        world_plan[(cube.z + half_of_map) * size_of_map + cube.x + half_of_map] = 1;
      }
      else if (wall_y == 10)
      {
        for (let dz = 0; dz < 3; dz++) 
        {
          world_plan[(cube.z + dz + half_of_map) * size_of_map + cube.x + half_of_map] = 3;
          world_plan[(cube.z + dz + half_of_map) * size_of_map + (cube.x + 1) + half_of_map] = 3;
        }
      }
    }
    else if (wall_y == 4)
    {
        let door = new Doors();
        door.axis = door_axis;
        door.x = wall_x;
        door.z = wall_z;
        door.y = 1.2;

        door.pivot = new THREE.Group();

        if (door.axis === "x")
        {
            door.geometry = new THREE.BoxGeometry(1, 2.4, 0.12);
            door.mesh = new THREE.Mesh(door.geometry, doors_block_materialy);

            door.pivot.position.set(door.x - 0.5, 1.2, door.z);
            door.mesh.position.set(0.5, 0, 0);
        }

        else
        {
            door.geometry = new THREE.BoxGeometry(0.12, 2.4, 1);
            door.mesh = new THREE.Mesh(door.geometry, door_material);

            door.pivot.position.set(door.x, 1.2, door.z - 0.5);
            door.mesh.position.set(0, 0, 0.5);
        }
        door.mesh.frustumCulled = true;
        door.open = 0;
        door.pivot.rotation.y = 0;
        door.pivot.add(door.mesh);
        scene.add(door.pivot);

        door.open = 0;

      world_plan[(door.z + half_of_map) * size_of_map + door.x + half_of_map] = 1;
    }
  }
  function add_wall_part(geometry, material)
  {
    if (material === wood_wall_material)
    {
      wall_geometries.push(geometry)
    }
    else if (material === roof_block_materialy)
    {
      roof_geometries.push(geometry);
    }
    else if (material === door_block_materialy)
    {
      dobl_geometries.push(geometry);
    }
  }

  let dvere_x = Math.floor(Math.random() * (length_of_room - 1)) + 1;
  let dvere_z = Math.floor(Math.random() * (width_of_room - 1)) + 1;
  let dvere_kde_x = Math.round(Math.random());
  let dvere_kde_y = Math.round(Math.random());

  for (let i = 0; i <= length_of_room; i++) 
  {
    if (i != dvere_x)
    {
      create_wall_cube(x + i, z, 2,0);
      create_wall_cube(x + i, z + width_of_room, 2,0);
    }
    else
    {
      if (dvere_kde_x == 0)
      {
        create_wall_cube(x + i, z, 0,"x");
        create_wall_cube(x + i, z + width_of_room, 2,0);  
      }
      else
      {
        create_wall_cube(x + i, z, 2,0);
        create_wall_cube(x + i, z + width_of_room, 0,"x");  
      }
    }
  }

  for (let j = 1; j < width_of_room; j++) 
  {
    if (j != dvere_z)
    {
      create_wall_cube(x, z + j, 2,0);
      create_wall_cube(x + length_of_room, z + j, 2,0);
    }
    else
    {
      if (dvere_kde_y)
      {
        create_wall_cube(x, z + j, 0,"z");
        create_wall_cube(x + length_of_room, z + j, 2,0);
      }
      else
      {
        create_wall_cube(x, z + j, 2,0);
        create_wall_cube(x + length_of_room, z + j, 0,"z");
      }
    }
  }

  for (let i = -1; i < length_of_room + 2; i++)
  {
    for (let j = -1; j < width_of_room + 2; j++)
    {
      create_wall_cube(x + i, z + j, 5);
    }
  }
  create_wall_cube(x + 1,z + 1,10,0);
  if (wall_geometries.length)
  {
      const merged_geometry = BufferGeometryUtils.mergeGeometries(
          wall_geometries,
          false
      );

      const wall_mesh = new THREE.Mesh(
          merged_geometry,
          wood_wall_material
      );
      house.add(wall_mesh);
      raycaster_all.push(wall_mesh);
  }
  if (roof_geometries.length)
  {
      let roof_up_geometries = [];
      let roof_down_geometries = [];

      for (const geometry of roof_geometries)
      {
          const non_indexed = geometry.toNonIndexed();

          for (let i = 0; i < non_indexed.groups.length; i++)
          {
              const group = non_indexed.groups[i];

              let face_geometry = new THREE.BufferGeometry();

              for (const name in non_indexed.attributes)
              {
                  const attribute = non_indexed.attributes[name];

                  const values = attribute.array.slice(
                      group.start * attribute.itemSize,
                      (group.start + group.count) * attribute.itemSize
                  );

                  face_geometry.setAttribute(
                      name,
                      new THREE.BufferAttribute(
                          values,
                          attribute.itemSize
                      )
                  );
              }

              if (i == 3)
              {
                  roof_down_geometries.push(face_geometry);
              }
              else
              {
                  roof_up_geometries.push(face_geometry);
              }
          }

          non_indexed.dispose();
      }

      const merged_up = BufferGeometryUtils.mergeGeometries(
          roof_up_geometries,
          false
      );

      const merged_down = BufferGeometryUtils.mergeGeometries(
          roof_down_geometries,
          false
      );

      if (merged_up)
      {
          house.add(
              new THREE.Mesh(
                  merged_up,
                  roof_up_block_mat
              )
          );
      }

      if (merged_down)
      {
          house.add(
              new THREE.Mesh(
                  merged_down,
                  roof_down_block_mat
              )
          );
      }

      for (const geometry of roof_geometries)
      {
          geometry.dispose();
      }
  }
  if (dobl_geometries.length)
  {
    const merged_geometry3 = BufferGeometryUtils.mergeGeometries(
          dobl_geometries,
          true
      );

      const dobl_mesh = new THREE.Mesh(
          merged_geometry3,
          door_block_materialy
      );
      house.add(dobl_mesh);
      raycaster_all.push(dobl_mesh);
  }
  scene.add(house);
}/*}}}*/

function collision(x, z)
{/*{{{*/
    let distance = 0.3;

    let points = [
        [x - distance, z],
        [x + distance, z],
        [x, z - distance],
        [x, z + distance],
        [x - distance, z - distance],
        [x + distance, z - distance],
        [x - distance, z + distance],
        [x + distance, z + distance]
    ];

    let on_bed = false; 

    for (let point of points)
    {
        let grid_x = Math.round(point[0] + half_of_map);
        let grid_z = Math.round(point[1] + half_of_map);

        if (grid_x < 0 || grid_x >= size_of_map ||
            grid_z < 0 || grid_z >= size_of_map)
        {
            return true;
        }

        let index = grid_z * size_of_map + grid_x;

        if (world_plan[index] === 1)
        {
            return true;
        }

        if (world_plan[index] === 3)
        {
            if (floor_gravitation != 0 || jump >= 6) 
            {
                on_bed = true;
            }
            else
            {
                return true;
            }
        }
    }

    if (on_bed)
    {
        floor_gravitation = 2; 
    }
    else
    {
        floor_gravitation = 0; 
    }

    return false;
}/*}}}*/

function can_I_jump(x,z)
{/*{{{*/
  for (let cube of Object.values(walls))
  {
    let wall_x = cube.mesh.position.x;
    let wall_z = cube.mesh.position.z;

    if (
      Math.abs(x - wall_x) < 0.8 &&
      Math.abs(z - wall_z) < 0.8 &&
      (cube.y == 3.2 || cube.y == 4.5))
    {
      return false;
    }
  }
  return true;
}/*}}}*/

function move_player(dx, dz)
{/*{{{*/
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
}/*}}}*/

//window resize
/*{{{*/
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
/*}}}*/

function am_I_movign()
{/*{{{*/
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
    }

    if (now_gravitation <= floor_gravitation)
    {
      now_gravitation = floor_gravitation;
      jump = 0;
    }
  }
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

    let se_pohybuje = false;

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
    camera.position.y = now_gravitation + 2.3;
  }
  else if (crouch == 1)
  {
    camera.position.y = now_gravitation + 1.55;
  }

  if (floor_gravitation == 1 || floor_gravitation == 2)
  {
    camera.position.y = now_gravitation + 1.55;
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

}/*}}}*/

function onPointerDown()
{/*{{{*/
    if (in_game != 1 || E_key != 1)
    {
      return;
    }
    pointer.set(0, 0);
    raycaster.setFromCamera(pointer, camera);
    const door_list = Object.values(doors);
    const door_meshes = door_list.map(door => door.mesh);
    const villager_list = Object.values(villagers);
    const villager_meshes = villager_list.map(villager => villager.mesh);

    const all_objects = [
        ...raycaster_all,
        ...door_meshes,
        ...villager_meshes
    ];

    raycaster.far = 5;

    const intersects = raycaster.intersectObjects(all_objects, true);

    if (intersects.length === 0)
    {
        return;
    }

    const hit_mesh = intersects[0].object;
    
    const door = door_list.find(d => d.mesh === hit_mesh);
    const villager = villager_list.find(v => 
      v.mesh === hit_mesh || v.mesh.getObjectById(hit_mesh.id) !== undefined
    );
    if (!door && !villager)
    {
      return;
    }
    let is_player_in_door = 0;
    if (door && door.x == Math.round(camera.position.x))
    {
      if (door && door.z == Math.round(camera.position.z))
      {
        is_player_in_door = 1; 
      }
    }
    if (door && E_key == 1 && door.opening == 0 && is_player_in_door == 0)
    {
      door.open = door.open === 0 ? 1 : 0;

      if (door.open === 1)
      {
          door.opening = 1;
          wooden_door_open.play();
          door.pivot.rotation.y = -((Math.PI / 2) / 8) * 1;
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 2;
          },125);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 3;
          },250);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 4;
          },375);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 5;
          },500);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 6
            world_plan[(door.z + half_of_map) * size_of_map + door.x + half_of_map] = 0;
          },625);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 7;
          },750);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 8;
            door.opening = 0;
          },875);
      }
      else if (door)
      {
          door.opening = 1;
          wooden_door_close.play();
          door.pivot.rotation.y = -((Math.PI / 2) / 8) * 7;
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 6;
          },125);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 5;
            world_plan[(door.z + half_of_map) * size_of_map + door.x + half_of_map] = 1;
          },250);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 4;
          },375);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 3;
          },500);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 2;
          },625);
          setTimeout(() => {
            door.pivot.rotation.y = -((Math.PI / 2) / 8) * 1;
          },750);
          setTimeout(() => {
            door.pivot.rotation.y = 0;
            door.opening = 0
          },875);
      }
    }
    else if (villager && E_key == 1 && villager.mluvim == 0)
    {
      villager.mluvim = 1;
      villager.dialog = 1;
      mluvim = 1;
    }
    else
    {
      return;
    }
}

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});/*}}}*/

function spawn_mods(mob)
{/*{{{*/
  if (mob == "chicken")
  {
    let vse_ok = 0;
    let attemps = 0;
    let chicken = new Mods();

    while (vse_ok == 0)
    {
      let kolize = 0;
      attemps++;

      if (attemps >= 100)
      {
        delete mods[chicken.id];
        return;
      }

      chicken.x = Math.floor(Math.random() * size_of_map) - half_of_map;
      chicken.z = Math.floor(Math.random() * size_of_map) - half_of_map;

      if (world_plan[(chicken.z + half_of_map) * size_of_map + chicken.x + half_of_map] == 1)
      {
        kolize = 1;
      }

      if (kolize == 0)
      {
        vse_ok = 1;
      }
    }
    chicken.cil_y = chicken.y;
    chicken.cil_x = chicken.x;
    chicken.y = 0;

    const material_noha = new THREE.MeshStandardMaterial({
      map: slepice_noha
    });

    const material_telo = new THREE.MeshStandardMaterial({
      map: slepice_telo
    });

    const material_hlava = [
      new THREE.MeshStandardMaterial({ map: slepice_hlava }),
      new THREE.MeshStandardMaterial({ map: slepice_telo }), 
      new THREE.MeshStandardMaterial({ map: slepice_telo }), 
      new THREE.MeshStandardMaterial({ map: slepice_telo }),
      new THREE.MeshStandardMaterial({ map: slepice_telo }),
      new THREE.MeshStandardMaterial({ map: slepice_telo }) 
    ];
    
    let chicken_rooster = Math.round(Math.random());

    chicken.mesh = new THREE.Group();

    function add_chicken_part(geometry, material)
    {
      const part = new THREE.Mesh(geometry, material);

      part.castShadow = false;
      part.receiveShadow = false;

      chicken.mesh.add(part);
    }

    const leg1 = new THREE.BoxGeometry(0.10,0.4,0.10);
    leg1.translate(0,0.2,-0.25);
    add_chicken_part(leg1, material_noha);

    const leg2 = new THREE.BoxGeometry(0.10,0.4,0.10);
    leg2.translate(0,0.2,0.25);
    add_chicken_part(leg2, material_noha);

    const body = new THREE.BoxGeometry(1.1,0.9,0.9);
    body.translate(0,0.82,0);
    add_chicken_part(body, material_telo);

    const head = new THREE.BoxGeometry(0.5,0.7,0.7);
    head.translate(0.6,1.27,0);
    add_chicken_part(head, material_hlava);
    
    if (chicken_rooster == 1)
    {
      const vole_material = new THREE.MeshStandardMaterial({
        map: kohout_hreben
      });
      const vole = new THREE.BoxGeometry(0.25,0.15,0.2);
      vole.translate(0.6,1.695,0);
      add_chicken_part(vole, vole_material);
      chicken.male_female = 0;
    }
    else
    {
      chicken.male_female = 1;
    }

    chicken.mesh.position.set(
      chicken.x,
      chicken.y,
      chicken.z
    );

    chicken.mesh.frustumCulled = true;

    scene.add(chicken.mesh);
    chicken.type = "chicken";
  }
  else if (mob == "villager")
  {
    let vse_ok = 0;
    let attemps = 0;
    let villager = new Mods();
    villagers[villager.id] = villager;

    while (vse_ok == 0)
    {
      let kolize = 0;
      attemps++;

      if (attemps >= 100)
      {
        delete mods[villager.id];
        return;
      }

      villager.x = Math.floor(Math.random() * size_of_map) - half_of_map;
      villager.z = Math.floor(Math.random() * size_of_map) - half_of_map;

      if (world_plan[(villager.z + half_of_map) * size_of_map + villager.x + half_of_map] == 1)
      {
        kolize = 1;
      }

      if (kolize == 0)
      {
        vse_ok = 1;
      }
    }
    
    villager.mesh = new THREE.Group();
    
    villager.cil_y = villager.y;
    villager.cil_x = villager.x;
    villager.y = 0;

    const arm_material = new THREE.MeshStandardMaterial({
        map: villager_arm
    });

    const neck_material = new THREE.MeshStandardMaterial({
        map: villager_neck
    });

    const body_material = new THREE.MeshStandardMaterial({
        map: villager_body
    });

    const materialnik = new THREE.MeshStandardMaterial({
        color: 0x00ff00
    });

    const leg_material = new THREE.MeshStandardMaterial({
        map: villager_leg
    });

    const villager_arm_material = [
      arm_material,/*{{{*/
      arm_material,
      body_material,
      villager_down_mat,
      arm_material,
      arm_material,
    ];/*}}}*/

    function add_villager_part(geometry, material,head)
    {
      const part = new THREE.Mesh(geometry, material);
      
      if (head == 1)
      {
        villager.head_mesh = part;
      }

      part.castShadow = false;
      part.receiveShadow = false;

      villager.mesh.add(part);
    }

    const leg1 = new THREE.BoxGeometry(0.45,1.2,0.4);
    leg1.translate(-0.3,0.7,0);
    add_villager_part(leg1, leg_material,0);

    const leg2 = new THREE.BoxGeometry(0.45,1.2,0.4);
    leg2.translate(0.3,0.7,0);
    add_villager_part(leg2, leg_material,0);

    const body = new THREE.BoxGeometry(1.3,1.5,0.8);
    body.translate(0,1.6,0);
    add_villager_part(body, body_material,0);

    const arm1 = new THREE.BoxGeometry(0.5,1.2,0.3);
    arm1.translate(-0.7,1.6,0);
    add_villager_part(arm1, villager_arm_material,0);

    const arm2 = new THREE.BoxGeometry(0.5,1.2,0.3);
    arm2.translate(0.7,1.6,0);
    add_villager_part(arm2, villager_arm_material,0);

    const neck = new THREE.BoxGeometry(0.5,1,0.4);
    neck.translate(0,2.1,0);
    add_villager_part(neck, neck_material,0);

    const head = new THREE.BoxGeometry(0.9,0.9,0.9);
    head.translate(0,3,0);
    const vlastni_head_material = villager_head_material.map(m => m.clone());
    add_villager_part(head, vlastni_head_material, 1);

 
    villager.mesh.position.set(
      villager.x,
      villager.y,
      villager.z
    );

    villager.mesh.frustumCulled = true;

    scene.add(villager.mesh);
    villager.type = "villager"; 

  }
}/*}}}*/

function show_FPS()
{/*{{{*/
  setTimeout(() => {
    vypis(frame_per_second);
    frame_per_second = 0;
  },1000);
}/*}}}*/

function vypis(FPS)
{/*{{{*/
  fpsNadpis.textContent = "FPS:" + FPS;
}/*}}}*/

function make_text(text, x, y, z) 
{/*{{{*/
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    context.font = 'Bold 48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.strokeStyle = 'black';
    context.lineWidth = 6;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);

    sprite.position.set(x, y, z);
    sprite.scale.set(2, 0.5, 1);

    scene.add(sprite);
    return sprite;
}/*}}}*/

function spawn_player()
{/*{{{*/
  let position_x = Math.floor(Math.random() * size_of_map + 1) - half_of_map;
  let position_z = Math.floor(Math.random() * size_of_map + 1) - half_of_map;
  let okkk = 0;
  let tries = 0;
  while (okkk == 0)
  {
    position_x = Math.floor(Math.random() * size_of_map + 1) - half_of_map;
    position_z = Math.floor(Math.random() * size_of_map + 1) - half_of_map;
    tries++;
    if (world_plan[position_z * 80 + position_x] == 1)
    {
      okkk = 0;
    }
    else
    {
      okkk = 1;
    }
  }

  camera.position.set(position_x, 2.3, position_z);
  return;
}/*}}}*/

