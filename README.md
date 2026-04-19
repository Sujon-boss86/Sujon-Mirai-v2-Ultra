<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=00FF00&height=200&section=header&text=SUJON%20MIRAI%20V2&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35" />
</div>
  
  <!-- Typing Animation -->
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=24&duration=3000&pause=1000&color=A020F0&center=true&vCenter=true&width=600&lines=Assalamualaikum+Everyone!;Welcome+To+SUJON+MIRAI+V2+Fork!" />
  
  <br><br>
  
  <!-- Hero Image with Glow -->
  <img src="https://i.postimg.cc/FR6Tdrnv/received-1461582061731133.jpg" width="300" style="border-radius: 20px; box-shadow: 0 0 30px #A020F0;" />
  
</div>
<br>
<div align="center">
  
  [![Forks](https://img.shields.io/github/forks/Sujon-boss86/Sujon-Mirai-v2-Ultra?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=8A2BE2)](https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra/fork)
  
  [![Stars](https://img.shields.io/github/stars/Sujon-boss86/Sujon-Mirai-v2-Ultra?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=FF1493)](https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra/stargazers)
  
  [![Repo Views](https://komarev.com/ghpvc/?username=Sujon-boss86&label=REPO%20VIEWS&color=8A2BE2&style=for-the-badge)](https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra)
  
  [![Original Repo](https://img.shields.io/badge/ORIGINAL%20REPO-000000?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117)](https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra)
  
</div>

<br>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<!-- ========== END PREMIUM GLOW SECTION ========== -->
### ❖ DEPLOY WORKFLOWS ❖
```
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    # Step to check out the repository code
    - uses: actions/checkout@v2

    # Step to set up the specified Node.js version
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}

    # Step to install dependencies
    - name: Install dependencies
      run: npm install

    # Step to run the bot with the correct port
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start
```

#### 🚀 Quick Start & Run Guide

```
git clone https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra.git
```
```
cd Sujon-Mirai-v2-Ultra
```
```
npm install
```
##### Start Command
```
node sujon.js
```
##### or
```
node Main.js
```


### 🚀 Deployments

| **Status** | **Action** |
|-----------|------------|
| <a href="https://replit.com"><img src="https://img.shields.io/badge/Replit-F26D00?style=for-the-badge&logo=replit&logoColor=white" width="200"></a> | <a href="https://replit.com"><img src="https://img.shields.io/badge/DEPLOY-NOW-blue?style=for-the-badge" width="200"></a> |
| <a href="https://render.com"><img src="https://img.shields.io/badge/Render-3FE0C5?style=for-the-badge&logo=render&logoColor=black" width="200"></a> | <a href="https://render.com"><img src="https://img.shields.io/badge/DEPLOY-NOW-blue?style=for-the-badge" width="200"></a> |
| <a href="https://railway.app"><img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" width="200"></a> | <a href="https://railway.app"><img src="https://img.shields.io/badge/DEPLOY-NOW-blue?style=for-the-badge" width="200"></a> |
| <a href="https://uptimerobot.com"><img src="https://img.shields.io/badge/UPTIME ROBOT-28A745?style=for-the-badge&logo=uptime&logoColor=white" width="200"></a> | <a href="https://uptimerobot.com"><img src="https://img.shields.io/badge/MONITOR-NOW-blue?style=for-the-badge" width="200"></a> |

<div align="center">

### 🌟 Special Feature

One of the most powerful features of this **Sujon Chat Bot** is its automatic configuration system.

✔ You **don't need to edit any command files**  
✔ Simply fill in your information inside the **anthor.json** file  
✔ The bot will automatically update all commands and settings  
✔ Fully customizable without touching the source code
✔ Admin noprefix work 

This makes the setup extremely easy, especially for beginners.



### 👨‍💻 About the Developer

<table>
  <tr>
    <td align="center"><b>Name</b></td>
    <td align="center">SUJON-BOSS</td>
  </tr>
  <tr>
    <td align="center"><b>NickName</b></td>
    <td align="center">SUJON</td>
  </tr>
  <tr>
    <td align="center"><b>Profession</b></td>
    <td align="center">Job & Chatbot Developer</td>
  </tr>
  <tr>
    <td align="center"><b>Location</b></td>
    <td align="center">Gazipur, Bangladesh</td>
  </tr>
</table>

**📞 Contact Information**

<!-- WhatsApp -->
<p>
<a href="https://wa.me/+8801813101538">
  <img 
    src="https://img.shields.io/badge/WhatsApp-Click%20Here-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" 
    height="45px">
</a>
</p>

<!-- Facebook -->
<p>
<a href="https://facebook.com/100093864940916">
  <img 
    src="https://img.shields.io/badge/Facebook-Click%20Here-1877F2?style=for-the-badge&logo=facebook&logoColor=white" 
    height="45px">
</a>
</p>

<!-- Messenger -->
<p>
<a href="https://m.me/100093864940916">
  <img 
    src="https://img.shields.io/badge/Messenger-Click%20Here-00B2FF?style=for-the-badge&logo=messenger&logoColor=white" 
    height="45px">
</a>
</p>

</div>

### ❖ SUPPORT
If you need any help, feel free to contact the admin.  
Please avoid unnecessary messages. Thank you for your support!

<p align="center">

  <a href="https://wa.me/+8801813101538?text=Assalamualaikum%20Admin%20Need%20Help%20Please%20Brother%20%F0%9F%AB%B6">
    <img alt="WhatsApp" src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" height="45px">
  </a>

</p>

🌺 Thank you for choosing **SUJON CHAT BOT** — your support helps us grow and build better Islamic digital tools.  
🗓️ **Release Date:** `22/04/2026 at 10:00 PM`  
⭐ Don't forget to give a **star** after forking!

<p align="center">
  <a href="https://github.com/Sujon-boss86/Sujon-Mirai-v2-Ultra.git">
    <img src="https://img.icons8.com/fluency/48/github.png" alt="GitHub" height="48px">
  </a>
  
  <a href="https://wa.me/+8801882333052">
    <img src="https://img.icons8.com/color/48/whatsapp.png" alt="WhatsApp" height="48px">
  </a>
  
  <a href="https://facebook.com/100093864940916">
    <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="Facebook" height="48px">
  </a>
</p>

**I hope you enjoy my fork! Thank you for supporting the CYBER BOT COMMUNITY!**
