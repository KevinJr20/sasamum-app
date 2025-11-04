# SasaMum AI Assistant - Testing & Improvement Guide

## Overview
The SasaMum AI assistant is currently implemented using a rule-based keyword matching system with template responses in multiple Kenyan languages. This guide explains how to test, validate, and improve the AI functionality.

---

## 1. Testing the Current Implementation

### Functionality Tests

#### A. Quick Action Buttons
1. Click each quick action button:
   - **Pregnancy Symptoms** → Should provide week-specific symptom information
   - **Nutrition Guide** → Should list iron-rich, calcium-rich foods
   - **Baby Development** → Should show current week baby size and development
   - **Emergency Help** → Should display emergency contacts (1190, 719)

2. Verify responses are contextually relevant
3. Check that all emergency numbers are accurate

#### B. Language Switching
1. Start a conversation in English
2. Switch language mid-conversation using the language selector
3. Send a new message
4. Verify the response is in the selected language

**Supported Languages:**
- 🇬🇧 English (en)
- 🇰🇪 Kiswahili (sw)
- 🇰🇪 Dholuo (luo)
- 🇰🇪 Luhya (luh)
- 🇰🇪 Kalenjin (kal)
- 🇰🇪 Kikamba (kam)

**Current Status:** Only English and Kiswahili have complete translations

#### C. Keyword Recognition
Test with these phrases to verify keyword matching:

| Keyword | Example Query | Expected Response |
|---------|--------------|-------------------|
| symptom/dalili | "What symptoms should I expect?" | Symptoms guide |
| food/chakula | "What should I eat?" | Nutrition guide |
| baby/mtoto | "How is my baby developing?" | Baby development info |
| emergency/dharura | "I need help!" | Emergency contacts |

#### D. Responsive Design
1. Test on iPhone 16 Pro Max (or similar small screen)
2. Verify chat window fits properly
3. Check that FAB (Floating Action Button) is accessible
4. Ensure text is readable and not cut off

---

## 2. Accuracy Verification

### Medical Information Sources
All medical content should align with:
- **WHO** (World Health Organization) guidelines
- **MOH Kenya** (Ministry of Health Kenya) pregnancy protocols
- **ACOG** (American College of Obstetricians and Gynecologists) where applicable

### Verification Checklist
- [ ] Emergency numbers are correct:
  - Ambulance: **1190** or **112**
  - Health Helpline: **719**
  - Mental Health: **0800 720 811**
- [ ] Nutrition advice includes local Kenyan foods
- [ ] Week-by-week baby development is medically accurate
- [ ] All advice includes appropriate disclaimers
- [ ] High-risk symptoms trigger immediate emergency response
- [ ] No medical advice that could be harmful

---

## 3. Improving Multi-Language Support

### Current Implementation Limitations
- Only 2 of 6 languages have complete translations (EN, SW)
- Template-based responses lack natural conversation flow
- No context retention between messages
- Limited vocabulary coverage

### Adding Luhya, Dholuo, Kalenjin, and Kikamba

#### Option 1: Manual Translation (Short-term)
```typescript
// Example: Adding Luhya translations
const aiResponses = {
  symptoms: {
    en: "At week 12, common symptoms include...",
    sw: "Katika wiki ya 12, dalili za kawaida ni...",
    luh: "Mukwiikulu 12, obulosi bwo bwemanyikha ni..." // ADD THIS
  }
}
```

**Steps:**
1. Hire native speakers or professional translators
2. Translate all response templates
3. Review for cultural appropriateness
4. Test with native speakers
5. Update `aiResponses` object in `/components/SasaMumAI.tsx`

#### Option 2: Translation API (Medium-term)
Use a translation service for real-time translation:

**Google Cloud Translation API:**
```typescript
import { Translate } from '@google-cloud/translate/v2';

const translate = new Translate({ key: 'YOUR_API_KEY' });

async function translateText(text: string, targetLang: string) {
  const [translation] = await translate.translate(text, targetLang);
  return translation;
}

// Usage
const response = await translateText(englishResponse, selectedLanguage);
```

**Pros:** Instant support for all languages  
**Cons:** Requires internet, costs money, may not be culturally accurate

---

## 4. AI Enhancement Options

### Current System: Rule-Based Keyword Matching
```typescript
if (message.includes('symptom')) {
  return symptomTemplate;
}
```

**Pros:** Fast, no external dependencies, predictable  
**Cons:** Limited understanding, no context, rigid responses

---

### Enhancement Option 1: OpenAI GPT Integration

**Best for:** Natural conversations, context understanding

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAIResponse(userMessage: string, language: string, week: number) {
  const systemPrompt = `You are a compassionate Kenyan pregnancy health assistant.
  - Current pregnancy week: ${week}
  - Response language: ${language}
  - Provide accurate, culturally-sensitive advice
  - Include emergency numbers: 1190 (Ambulance), 719 (Health)
  - Always recommend professional consultation for serious concerns`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
}
```

**Pros:**
- Natural language understanding
- Context-aware responses
- Multilingual support (GPT-4 especially)
- Conversational memory
- Can handle complex questions

**Cons:**
- Requires API key ($)
- Internet connection required
- Response time ~2-5 seconds
- Need to ensure medical accuracy
- Privacy considerations (PHI data sent to OpenAI)

**Cost Estimate:**
- GPT-3.5: ~$0.002 per conversation
- GPT-4: ~$0.03 per conversation

---

### Enhancement Option 2: Hugging Face Models (Open Source)

**Best for:** Free, self-hosted, privacy-focused

```typescript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference('YOUR_HF_TOKEN');

async function getAIResponse(userMessage: string) {
  const prompt = `Context: Pregnancy health assistant for Kenyan mothers
Question: ${userMessage}
Answer:`;

  const response = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    inputs: prompt,
    parameters: {
      max_new_tokens: 256,
      temperature: 0.7
    }
  });

  return response.generated_text;
}
```

**Recommended Models:**
- `mistralai/Mistral-7B-Instruct-v0.2` - General purpose
- `microsoft/BioGPT` - Medical knowledge
- `bigscience/bloom-7b1` - Multilingual

**Pros:**
- Free (with limits)
- Open source
- Can fine-tune on custom data
- No vendor lock-in

**Cons:**
- Slower than GPT-4
- May require fine-tuning
- Quality varies by model
- Still requires internet (unless self-hosted)

---

### Enhancement Option 3: Google DialogFlow

**Best for:** Structured conversations, built-in multilingual support

**Setup:**
1. Create DialogFlow agent
2. Define intents (symptoms, nutrition, baby, emergency)
3. Add training phrases
4. Configure webhook for custom responses

**Pros:**
- Visual conversation designer
- Built-in NLU (Natural Language Understanding)
- Native multilingual support
- Easy integration with Google Cloud

**Cons:**
- Requires Google Cloud account
- Learning curve for setup
- Less flexible than code-based solutions

---

### Enhancement Option 4: Rasa Open Source

**Best for:** Full control, on-premise deployment, privacy

**Architecture:**
```
User Message → Rasa NLU → Intent Classification → Rasa Core → Response
```

**Training Data Example:**
```yaml
# domain.yml
intents:
  - ask_symptoms
  - ask_nutrition
  - ask_emergency

responses:
  utter_symptoms:
    - text: "At week {week}, common symptoms include..."
```

**Pros:**
- Completely self-hosted
- Full data privacy
- Customizable NLU pipeline
- Free and open source

**Cons:**
- Complex setup
- Requires training data
- Need server infrastructure
- Maintenance burden

---

## 5. Recommended Implementation Plan

### Phase 1: Immediate (Week 1-2)
1. **Complete manual translations** for all 6 languages
2. **Hire native speakers** to review cultural appropriateness
3. **Add conversation history** (localStorage)
4. **Implement better keyword matching** (fuzzy matching, synonyms)

### Phase 2: Short-term (Month 1)
1. **Integrate OpenAI GPT-3.5** for English conversations
2. **Add Supabase backend** for conversation logging
3. **Implement feedback system** (thumbs up/down on responses)
4. **A/B testing** with users

### Phase 3: Medium-term (Month 2-3)
1. **Fine-tune custom model** on Kenyan pregnancy health data
2. **Add voice input/output** for low-literacy users
3. **Implement offline mode** with cached responses
4. **Create admin dashboard** for monitoring conversations

### Phase 4: Long-term (Month 4+)
1. **Deploy self-hosted AI** (Rasa or custom model)
2. **HIPAA/GDPR compliance** for PHI data
3. **Integration with CHW portal** for escalation
4. **Predictive health insights** based on conversation patterns

---

## 6. Testing Checklist Before Production

### Functional Tests
- [ ] All quick actions work
- [ ] Language switching works mid-conversation
- [ ] Keyword recognition is accurate (>90%)
- [ ] Emergency responses are immediate
- [ ] Chat history persists across sessions
- [ ] Mobile responsive (all screen sizes)
- [ ] FAB doesn't block content

### Content Accuracy
- [ ] Emergency numbers verified
- [ ] Medical information reviewed by healthcare professional
- [ ] All translations verified by native speakers
- [ ] Cultural sensitivity review completed
- [ ] Disclaimers present on medical advice

### Performance
- [ ] Response time < 3 seconds
- [ ] Chat window loads in < 1 second
- [ ] No memory leaks in long conversations
- [ ] Handles 50+ messages gracefully
- [ ] Works on slow 3G networks

### Accessibility
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Text is resizable
- [ ] Focus indicators visible

### Security
- [ ] No PHI sent to third parties (without consent)
- [ ] XSS protection
- [ ] Input sanitization
- [ ] Rate limiting on API calls
- [ ] HTTPS only

---

## 7. Monitoring & Improvement

### Metrics to Track
1. **Usage Metrics:**
   - Daily active users
   - Messages per session
   - Most common queries
   - Language distribution

2. **Quality Metrics:**
   - User satisfaction (feedback ratings)
   - Response relevance (manual review sample)
   - Escalation rate (queries requiring human help)
   - Conversation completion rate

3. **Technical Metrics:**
   - Response time (p50, p95, p99)
   - Error rate
   - API costs (if using external AI)
   - Uptime

### Continuous Improvement
1. **Weekly:** Review user feedback and common queries
2. **Monthly:** Update response templates based on new medical guidelines
3. **Quarterly:** Add new features based on user requests
4. **Yearly:** Major AI model upgrade/replacement

---

## 8. Resources

### Medical Guidelines
- [WHO Pregnancy Guidelines](https://www.who.int/health-topics/maternal-health)
- [MOH Kenya Maternal Health](https://www.health.go.ke/)
- [ACOG Practice Bulletins](https://www.acog.org/clinical)

### Translation Services
- [Google Cloud Translation](https://cloud.google.com/translate)
- [AWS Translate](https://aws.amazon.com/translate/)
- [DeepL](https://www.deepl.com/pro-api)

### AI/ML Resources
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Hugging Face Models](https://huggingface.co/models)
- [Rasa Documentation](https://rasa.com/docs)
- [DialogFlow Docs](https://cloud.google.com/dialogflow/docs)

---

## Contact & Support
For questions about implementation:
- Review the code in `/components/SasaMumAI.tsx`
- Check inline documentation
- Test thoroughly before deploying to production

**Remember:** This AI provides general information only. Always recommend users consult healthcare professionals for medical advice.
