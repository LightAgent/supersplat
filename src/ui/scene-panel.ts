import { BooleanInput, Container, Element, Label } from '@playcanvas/pcui';

import { Events } from '../events';
import { localize } from './localization';
import { SplatList } from './splat-list';
import sceneImportSvg from './svg/import.svg';
import sceneNewSvg from './svg/new.svg';
import { Tooltips } from './tooltips';
import { Transform } from './transform';

const createSvg = (svgString: string) => {
    const decodedStr = decodeURIComponent(svgString.substring('data:image/svg+xml,'.length));
    return new DOMParser().parseFromString(decodedStr, 'image/svg+xml').documentElement;
};

class ScenePanel extends Container {
    constructor(events: Events, tooltips: Tooltips, args = {}) {
        args = {
            ...args,
            id: 'scene-panel',
            class: 'panel'
        };

        super(args);

        // stop pointer events bubbling
        ['pointerdown', 'pointerup', 'pointermove', 'wheel', 'dblclick'].forEach((eventName) => {
            this.dom.addEventListener(eventName, (event: Event) => event.stopPropagation());
        });

        const sceneHeader = new Container({
            class: 'panel-header'
        });

        const sceneIcon = new Label({
            text: '\uE344',
            class: 'panel-header-icon'
        });

        const sceneLabel = new Label({
            text: localize('panel.scene-manager'),
            class: 'panel-header-label'
        });
        
        const sceneImport = new Container({
            class: 'panel-header-button'
        });
        sceneImport.dom.appendChild(createSvg(sceneImportSvg));

        const sceneNew = new Container({
            class: 'panel-header-button'
        });
        sceneNew.dom.appendChild(createSvg(sceneNewSvg));

        sceneHeader.append(sceneIcon);
        sceneHeader.append(sceneLabel);
        sceneHeader.append(sceneImport);
        sceneHeader.append(sceneNew);

        sceneImport.on('click', async () => {
            await events.invoke('scene.import');
        });

        sceneNew.on('click', () => {
            events.invoke('doc.new');
        });

        tooltips.register(sceneImport, 'Import Scene', 'top');
        tooltips.register(sceneNew, 'New Scene', 'top');

        const splatList = new SplatList(events);

        const splatListContainer = new Container({
            class: 'splat-list-container'
        });
        splatListContainer.append(splatList);

        const transformHeader = new Container({
            class: 'panel-header'
        });

        const transformIcon = new Label({
            text: '\uE111',
            class: 'panel-header-icon'
        });

        const transformLabel = new Label({
            text: localize('panel.scene-manager.transform'),
            class: 'panel-header-label'
        });

        transformHeader.append(transformIcon);
        transformHeader.append(transformLabel);
        
        const segmentationHeader = new Container({
            class: 'panel-header'
        });

        const segmentationIcon = new Label({
            text: "\uE53B",
            class: 'panel-header-icon'
        });

        const segmentationLabel = new Label({
            text: "Segmentation",
            class: 'panel-header-label'
        });

        segmentationHeader.append(segmentationIcon);
        segmentationHeader.append(segmentationLabel);

        this.append(sceneHeader);
        this.append(splatListContainer);
        this.append(transformHeader);
        this.append(new Transform(events));
        this.append(new Element({
            class: 'panel-header',
            height: 20
        }));
        this.append(segmentationHeader);

        // segmentation choices 
        const segmentationOptions = new Container({
            class: 'segmentation-options',
            flex: true,
            flexDirection: 'column'
        });
        
        // Make the container scrollable
        segmentationOptions.dom.style.maxHeight = '200px';
        segmentationOptions.dom.style.overflowY = 'auto';

        const segmentationInputs: BooleanInput[] = [];

        const selectedLabels: string[] = [];

        const segmentationColors: { [key: string]: [number, number, number] } = {
            'Outer Layer': [180, 180, 180],
            'Csf': [255, 255, 0],
            'Fat': [0, 255, 255],
            'Gli': [128, 0, 128],
            'Grey': [128, 128, 128],
            'Muscle + Skin': [255, 0, 255],
            'Mit': [255, 128, 0],
            'Skull': [255, 0, 0],
            'Skin': [0, 128, 255],
            'White': [0, 0, 255]
        };

        Object.keys(segmentationColors).forEach((label, index) => {
            const row = new Container({
                class: 'segmentation-option-row'
            });

            const input = new BooleanInput();
            segmentationInputs.push(input);

            input.on('change', async (value: boolean) => {
                if (value) {
                    // adding to the list of selected
                    selectedLabels.push(label);
                    // Unhide all first to start fresh
                    // events.fire('select.all');
                    // events.fire('select.visibleOnly');
                    
                    // events.fire('select.unhide');
                    
                    // Select by color
                    // events.fire('select.byRgb', 'add', rgb, 0.4);
                    
                    // Now hide everything except the selection
                    
                    
                    // Restore the color selection for visibility
                    // events.fire('select.byRgb', 'add', rgb, 0.4);
                } else {
                    // events.fire('select.byRgb', 'remove', rgb, 0.4);
                    // selectedLabels.splice(selectedLabels.indexOf(label),1);
                    // safer approach to remove from the dictionary
                    const index = selectedLabels.indexOf(label);

                    if (index > -1) {
                        selectedLabels.splice(index, 1);
                    }
                    // Unhide all when unchecked
                    // events.fire('select.unhide');
                    // events.fire('select.none');
                }
                if (selectedLabels.length != 0){
                    console.log(selectedLabels);
                    events.fire('select.unhide'); // unhides all to start fresh :: all unlocked
                    // need to unselect the ones that got unhidden but were selected to completely start fresh : so unselect these 001
                    events.fire('select.clearPure');
                    selectedLabels.forEach((label)=>{ // then selects each of the selected colors
                        events.fire('select.byRgb', 'add', segmentationColors[label], 0.4); // thr = 0.4
                    })
                    events.fire('select.invert'); // invert selection
                    events.fire('select.hide'); // hide the selected
                }else{
                    console.log("Unhiding everything")
                    events.fire('select.unhide');
                    events.fire('select.none');
                }
            });
            
            row.append(input);
            
            row.append(new Label({
                text: label,
                flex: true,
                height: 30
            }));
            
            segmentationOptions.append(row);
        });
        
        this.append(segmentationOptions);
        
        // Button to invert selection and hide
        const hideUnselectedButton = new Container({
            class: 'panel-header-button'
        });
        hideUnselectedButton.append(new Label({ text: 'Hide Unselected' }));
        hideUnselectedButton.on('click', () => {
            events.fire('select.invert');
            events.fire('select.hide');
            // events.fire('select.none');
        });
        tooltips.register(hideUnselectedButton, 'Hide all unselected splats', 'top');
        this.append(hideUnselectedButton);

        // Button to select only visible splats
        const selectVisibleButton = new Container({
            class: 'panel-header-button'
        });
        selectVisibleButton.append(new Label({ text: 'Select Visible' }));
        selectVisibleButton.on('click', () => {
            events.fire('select.visibleOnly');
        });
        tooltips.register(selectVisibleButton, 'Select only visible splats', 'top');
        this.append(selectVisibleButton);
        
        
    }
}

export { ScenePanel };
