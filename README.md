HOW TO RUNNING THE AUTOMATION TEST CODE WITH APPIUM (ANDROID):

1. **Open CMD (Command Prompt), then run the command below. It's used to open the Appium port.**
   
   ```bash
   appium -p 4723

2. **Open Android Studio, then run one of the Android emulators that you’ve created and make sure its configuration matches the capabilities in the wdio.conf.js file.**
   
   <img width="1512" height="945" alt="Screenshot 2025-09-18 at 10 42 32 AM" src="https://github.com/user-attachments/assets/d849180e-c244-41a2-ae30-fbab971aa89f" />

3. **Open Appium Inspector, then click "Start Session" to start a session alongside the emulator running in Android Studio.**

   <img width="1506" height="944" alt="image" src="https://github.com/user-attachments/assets/df1a9fed-3af5-4229-b505-28ceea00cba4" />

4. **Open VS Code to access your Android automation script project.**

5. **To run the automation script, execute the command below in the terminal:**
   
   ```bash
   npx wdio run ./wdio.conf.js
   npx wdio run ./wdio.conf.ts --spec ./test/specs/login.t (specific file)
   npx wdio run ./wdio.conf.ts —spec (all the file inside spec)
   npm test -- --spec test/specs/3-register.ts (specific file)
   
6. **While the command is running, keep the Android emulator open so you can see the automation test running live on the device.**
