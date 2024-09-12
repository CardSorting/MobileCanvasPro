from PIL import Image, ImageEnhance, ImageFilter

def process_image(input_path, output_path, operations):
    with Image.open(input_path) as img:
        for operation in operations:
            op_type = operation['type']
            if op_type == 'crop':
                left, top, right, bottom = operation['params']
                img = img.crop((left, top, right, bottom))
            elif op_type == 'resize':
                width, height = operation['params']
                img = img.resize((width, height))
            elif op_type == 'rotate':
                angle = operation['params'][0]
                img = img.rotate(angle)
            elif op_type == 'filter':
                filter_name = operation['params'][0]
                if filter_name == 'BLUR':
                    img = img.filter(ImageFilter.BLUR)
                elif filter_name == 'CONTOUR':
                    img = img.filter(ImageFilter.CONTOUR)
                elif filter_name == 'EMBOSS':
                    img = img.filter(ImageFilter.EMBOSS)
            elif op_type == 'adjust':
                adjust_type, factor = operation['params']
                if adjust_type == 'brightness':
                    enhancer = ImageEnhance.Brightness(img)
                    img = enhancer.enhance(factor)
                elif adjust_type == 'contrast':
                    enhancer = ImageEnhance.Contrast(img)
                    img = enhancer.enhance(factor)
                elif adjust_type == 'saturation':
                    enhancer = ImageEnhance.Color(img)
                    img = enhancer.enhance(factor)
        
        img.save(output_path)
