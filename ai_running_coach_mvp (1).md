# AI Running Coach MVP

## 🎯 MVP Goal
> During a run, the app notices one situation (uphill) and gives one helpful voice tip at the right moment.

## 🧩 MVP Scope
- **Supported activity**: Running only
- **Supported device**: Garmin only
- **Coaching type**: Real-time voice coaching
- **No plans, analytics, or AI personalization yet**

## 🟢 Killer Scenario
**Uphill fatigue**
- Easy to detect
- Emotionally intense
- Users feel immediate help

## 🔍 Detection Rules
Trigger coaching when ALL conditions are true:
- Grade ≥ +3%
- Pace drops ≥ 7% vs last 5 minutes
- Heart rate trending up

## 🗣️ Coaching Messages
Pre-recorded, ≤ 5 seconds each, rotate randomly:
1. "Ease the pace. Shorten your stride. You’re doing fine."
2. "This climb counts. Breathe steady."
3. "Slow is strong. Stay tall."
4. "You didn’t come this far to stop."
5. "Control the effort, not the hill."

## 🔔 Delivery
- Watch vibrates once
- Phone plays audio through headphones
- Hands-free, no TTS customization

## 📱 Mobile App Features
**Home screen:**
- Toggle: `Coach ON / OFF`
- Setting: `Encouraging` tone only

**During run:**
- No UI distraction

**After run:**
- Summary: "Coach spoke to you X times during climbs"

## 💸 Monetization
- Free: 2 coached runs/week
- Upgrade prompt after 2nd coached run
- Pro: Unlimited coaching — €7.99/month

## 🔐 Login & Identity (MVP)

### Principle
No visible login. No email. No password.

### Identity Strategy
- On first app launch, generate a **device-based UUID** and store it securely (Keychain / Keystore).
- This UUID represents the user in the MVP.

Used for:
- Free run limits
- Subscription status
- Basic analytics

### Garmin Connection
- User taps **"Connect Garmin"**
- Garmin OAuth flow opens
- User approves access
- Garmin user ID is stored **hashed** and linked to the device UUID

Garmin acts as:
- Data source
- Soft identity anchor (not primary auth)

### Payments
- Apple In-App Purchase / Google Play Billing
- Subscription tied to app store account + device
- No account creation required

### Stored Data (Minimal)
- Device UUID
- Hashed Garmin user ID
- Coached run count
- Subscription status

No name, no email, no birthday.

### Future Upgrade Path (Not MVP)
Add real login only when needed for:
- Cross-device sync
- Web dashboard
- Community features

Preferred future options:
1. Sign in with Apple / Google
2. Email magic link

---

## 🛠️ Tech Stack
- Garmin Connect IQ: Detect grade, trigger vibration
- Mobile app: React Native
- Backend: Minimal or none initially
- Audio: Preloaded MP3s

## ⏱️ Build Time
- 1–2 weeks: Garmin detection + vibration
- 1 week: Mobile app + audio
- 1 week: Polish + beta test
- **Total**: ~4 weeks to first user feedback

## 📏 Success Criteria
- Users report:
  - "It spoke at the right moment"
  - "It helped me not quit"
  - "I missed it when it was off"

## 🚀 Excluded Features
- Training plans
- AI personalization
- Social features
- Beautiful graphs
- Multiple sports
- Coach marketplace

