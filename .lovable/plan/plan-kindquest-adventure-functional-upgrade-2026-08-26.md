# Plan: KindQuest Adventure Functional Upgrade

## Scope
Update only the existing KindQuest Adventure onboarding game and the small dashboard/profile entry point needed to re-open exploration. Preserve the current app, navigation, AI onboarding, browse flow, branding, theme, and mock data.

## What will change

1. **Real cross-device dragging**
   - Replace click-to-place and native HTML drag/drop in the mini-game with pointer-event dragging.
   - A piece must be pressed, dragged, moved over a valid target, and released to count.
   - Clicking/tapping a target by itself will do nothing.
   - Invalid drops will return the piece to the tray and show gentle feedback.

2. **Drag feedback**
   - Dragged pieces will follow the pointer/finger, lift visually, scale slightly, and use a stronger shadow.
   - Drop zones will highlight when a piece is nearby/over them.
   - Successful drops will snap into place and play the existing completion animation.
   - Touch behavior will use `touch-action: none` on draggable pieces to avoid accidental scrolling during drag.

3. **Persistent adventure profile**
   - Add a small frontend persistence module using localStorage for demo state.
   - Store: adventure progress, visited destinations, completed interactions, discovered interests, activity preferences, discovered skills, volunteering mode, availability, and exploration history.
   - Keep this data additive so “Explore More” never overwrites earlier discoveries.

4. **Richer discovery data**
   - Extend adventure destination metadata with interaction ids, activity preferences, and inferred skills.
   - Initial map completions will record concrete interaction history and profile discoveries.

5. **Post-game decision screen**
   - Keep the existing interest results/profile step, then add the requested decision screen:
     - “Start Volunteering” → location/availability if needed → personalized opportunities.
     - “Explore More” → deeper exploration mode.

6. **Deeper exploration mode**
   - Add additional mini-adventures in the same drag-based format for remote/in-person mode, activity style, and skills.
   - Show a “Your KindQuest Profile” progress panel and new discovery feedback.
   - Provide “I’m Ready” / “Find My Opportunities” at all times.

7. **Recommendations with why-matches**
   - Rank/filter opportunities using the full persisted exploration history, not just the latest session.
   - Show “Why this matches you” bullets tied to explored destinations, causes, activity preferences, skills, mode, and availability.

8. **Return path from dashboard/profile**
   - Add an “Explore More Ways to Help” action that opens the game directly in deeper exploration mode while retaining previous discoveries.

## Validation
- Run a targeted TypeScript check.
- Browser-test desktop drag: target click does nothing, invalid drop returns, valid drop completes.
- Browser-test a mobile viewport touch drag.
- Browser-test additive exploration history and recommendation reasons.
