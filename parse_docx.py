from docx import Document
import sys

def parse_docx(filepath):
    doc = Document(filepath)
    rels = doc.part.rels
    
    for para in doc.paragraphs:
        print(para.text)
        
        # Check for images in this paragraph
        for run in para.runs:
            if 'drawing' in run._element.xml:
                for rel in rels.values():
                    if 'image' in rel.target_ref:
                        # Print the actual rId and target_ref
                        # We have to parse the drawing XML to get the specific rId
                        xml = run._element.xml
                        if 'embed' in xml:
                            import re
                            match = re.search(r'embed="([^"]+)"', xml)
                            if match:
                                rId = match.group(1)
                                rel = rels[rId]
                                print(f"[IMAGE: {rel.target_ref}]")

if __name__ == '__main__':
    parse_docx(sys.argv[1])
