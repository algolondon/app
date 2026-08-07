# coding=utf-8
import sys
import re

with open('src/app/HomeClient.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
text = text.replace(
    'import { Footer } from "@/components/footer";',
    'import { Footer } from "@/components/footer";\nimport { MockupFrame } from "@/components/mockup-frame";'
)

# 2. Image replacements (matching using simpler substrings)

text = text.replace(
    '<div className="rounded-lg overflow-hidden border border-foreground/5 bg-muted mb-4">\n                    <Image src="/chart-screenshot-1.svg" alt="Chart Preview" width={600} height={300} className="w-full opacity-80" />\n                  </div>',
    '<MockupFrame title="16LONDON TREND ALGO V1 · CHART PREVIEW" className="w-full">\n                    <div className="relative w-full h-full">\n                      <Image src="/images/new_assets/Trend Algo Rules  Image.png" alt="Chart Preview" width={600} height={300} className="w-full opacity-80" />\n                    </div>\n                  </MockupFrame>'
)

text = text.replace(
    '<Image src="/chart-screenshot-2.svg" alt="Trend ALGO" width={600} height={400} className="rounded-xl border border-foreground/10" />',
    '<MockupFrame title="16LONDON TREND ALGO V1">\n                  <Image src="/images/new_assets/Trend Algo image 1.png" alt="Trend ALGO" width={600} height={400} className="w-full" />\n                </MockupFrame>'
)

text = text.replace(
    '<Image src="/rules-infographic.svg" alt="London X" width={600} height={400} className="rounded-xl border border-foreground/10" />',
    '<MockupFrame title="LONDON X BREAKOUT">\n                  <Image src="/images/new_assets/London X image 1.png" alt="London X" width={600} height={400} className="w-full" />\n                </MockupFrame>'
)

text = text.replace(
    '<Image src="/chart-screenshot-1.svg" alt="ATM System" width={600} height={400} className="rounded-xl border border-foreground/10" />',
    '<MockupFrame title="16LONDON ATM SYSTEM">\n                  <Image src="/images/new_assets/ATM System Image 1.png" alt="ATM System" width={600} height={400} className="w-full" />\n                </MockupFrame>'
)

text = text.replace(
    '<div className="absolute inset-0 bg-[#00D4FF] blur-[80px] opacity-20 rounded-full"></div>\n              <Image src="/chart-screenshot-2.svg" alt="Phone Mockup" width={600} height={800} className="relative z-10 rounded-[2rem] border-4 border-[#0D1F3C] shadow-2xl" />',
    '<div className="absolute inset-0 bg-[#00D4FF] blur-[80px] opacity-20 rounded-full"></div>\n              <MockupFrame title="16LONDON TREND ALGO V1 · RULES & SETTINGS" className="relative z-10 shadow-2xl">\n                <Image src="/images/new_assets/Trend Algo Rules  Image.png" alt="Rules Mockup" width={600} height={800} className="w-full" />\n              </MockupFrame>'
)

# 3. Remove 5.5 Testimonials
# Using regex to remove the section
pattern = r"\{/\* 5\.5 TESTIMONIALS \*/\}.*?(?=\{/\* 6\. PRICING \*/\})"
text = re.sub(pattern, "", text, flags=re.DOTALL)

# 4. Carl -> Kazi
text = text.replace('Carl', 'Kazi').replace('carl', 'kazi')

# Also fix the weird line endings if any
text = text.replace('\r\n', '\n')

with open('src/app/HomeClient.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
