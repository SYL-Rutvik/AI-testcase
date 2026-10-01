import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def embed_current_screenshots():
    doc_path = 'AI_Powered_Test_Case_Generator_Project-Report.docx'
    doc = docx.Document(doc_path)
    
    screenshots_dir = os.path.abspath('screenshots')
    
    # Map of placeholder text or index to image
    image_mappings = {
        'fig_8_1_dashboard.png': ('Figure 8.1:', 'Figure 8.1: QA Project Dashboard displaying Total Test Suites, Active Test Cases, Total Scenarios Generated, Pass Rate Bar, and Recent Activity Stream.'),
        'fig_8_2_generator.png': ('Figure 8.2:', 'Figure 8.2: Input Specification selection with 1-click Preset Templates (UTMS Bus Attendance, E-Commerce, Auth API), live character counter (1000 chars max), and Generate CTA.'),
        'fig_8_3_generation_progress.png': ('Figure 8.3:', 'Figure 8.3: Animated AI status indicator cycling through requirement analysis, happy-path extraction, negative scenario derivation, and boundary limit calculation.'),
        'fig_8_4_table_execution.png': ('Figure 8.4:', 'Figure 8.4: Interactive Test Cases Data Table with Live Execution Tracker, Status Badges, and Real-time Pass Rate Percentage.'),
        'fig_8_5_add_case_modal.png': ('Figure 8.6:', 'Figure 8.6: Modal dialog enabling QA testers to manually author and append custom test scenarios with full step sequencing and priority metadata.')
    }
    
    # Iterate through paragraphs to find matching placeholders
    for i in range(len(doc.paragraphs)):
        p = doc.paragraphs[i]
        for img_name, (fig_prefix, full_caption) in image_mappings.items():
            img_path = os.path.join(screenshots_dir, img_name)
            if os.path.exists(img_path) and fig_prefix in p.text:
                # Next paragraph should be the placeholder
                if i + 1 < len(doc.paragraphs):
                    next_p = doc.paragraphs[i + 1]
                    if 'Screenshot Placeholder' in next_p.text:
                        next_p.text = '' # Clear placeholder text
                        run = next_p.add_run()
                        run.add_picture(img_path, width=Inches(5.8))
                        next_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        next_p.paragraph_format.space_before = Pt(6)
                        next_p.paragraph_format.space_after = Pt(12)
                        print(f"Successfully embedded {img_name} at paragraph {i+1}")

    doc.save(doc_path)
    print("Document successfully updated and saved!")

if __name__ == '__main__':
    embed_current_screenshots()
