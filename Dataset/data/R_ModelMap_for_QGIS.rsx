##Landslide Susceptibility Mapping with R and ModelMap=group
##R ModelMap for QGIS=name
##Working_Folder=folder path to working folder
##Factors_folder=folder path to folder containing factor rasters

#Landslide_Inventory=vector Sampled_Points
##Train_Data=vector trainingPointsSampled
#Test_Data=vector testingPointsSampled
#Proportion_for_test=number 0.2

##Aspect=raster aspect
##DTM=raster dtm
##Distance_to_rivers=raster rivers
##NDVI=raster ndvi
##Profile_curvature=raster profile
##Plan_curvature=raster plan
##Distance_to_faults=raster faults
##DUSAF=raster dusaf
##Distance_to_roads=raster roads

#rastLUT=vector rasterLUT

##Model_Type=string "RF"
##MODELfn=string "Susceptibility_Map"
##Response_Name=string "Hazard"
##Response_Type=string "continuous"
##Seed=number 50
##Unique_Rowname=string "fid"

predList=c("aspect","dtm","ndvi","rivers","faults","dusaf","roads","plan","profile")
predFactor=c("rivers","faults","dusaf","roads")

setwd(Working_Folder)
qdataf=data.frame(Train_Data)
qdatafn=qdataf[1:(length(qdataf)-1)]
#qtestf=data.frame(Test_Data)
#qtestfn=qtestf[1:(length(qdataf)-1)]
#print(qdatafn)

#require("ModelMap")
library("ModelMap")
print('LIBRARY READY')

#this library is needed for separating dataframe column into 2
library(tidyr)

#read full paths of all the files in Factor folder
path <-list.files(Factors_folder,full.names = TRUE)
#read file names of all the files in Factor folder
file <-list.files(Factors_folder)

#create dataframe of two columns - paths and filenames
path_df=as.data.frame(list(path, file))
#rename first column to "rast"
names(path_df)[1] <- "rast"
#rename second column to "pred"
names(path_df)[2] <- "pred"
#split column pred into 2 columns (because it contains filename.extension format e.g aspect.tif. Give names to new columns "pred" and band. Use "." as separator
path_df=separate(data = path_df, col = pred, into = c("pred", "band"), sep = "\\.")
#replace "img" with 1 whenever it is found in dataframe
path_df[path_df == "tif"] <- 1
#replace other values to match the values of original rastLUT

#store dataframe in the working folder without index column
write.csv(path_df,"rasterLUT.csv", row.names = FALSE)
#load rastLUT
rastLUT=list.files(path=getwd(), full.names=TRUE, pattern="*rasterLUT.csv")

#get.test(proportion.test=0.0, qdatafn=qdatafn, seed=42, folder=Working_Folder,qdata.trainfn=Train_Data, qdata.testfn=Test_Data)
#print('Train/separation READY')
print(rastLUT)

model.explore(qdata.trainfn = qdatafn, folder = Working_Folder, predList = predList,
predFactor = predFactor, response.name = Response_Name, response.type = Response_Type,device.type=c("jpeg"), 
response.colors = response.colors, unique.rowname = Unique_Rowname,units="px", device.width=8000, device.height=4000,MAXCELL=300000,
jpeg.res = 300,res=300, cex=1.5, rastLUTfn = rastLUT, na.value = -9999, col.ramp = heat.colors(101),col.cat = c("wheat1","springgreen2","darkolivegreen4","darkolivegreen2","yellow","thistle2","brown2","brown4"))
print('Model Explore FINISHED')

model.obj=model.build(model.type=Model_Type, qdata.trainfn=qdatafn, folder=Working_Folder,  MODELfn=MODELfn, predList=predList,
predFactor = predFactor, response.name=Response_Name,na.action = "na.omit", response.type=Response_Type, unique.rowname=Unique_Rowname,seed=Seed)
print('Model Build FINISHED')

model.diagnostics=model.diagnostics(model.obj = model.obj, qdata.trainfn = qdatafn,
folder = Working_Folder, MODELfn = MODELfn, response.name = Response_Name, unique.rowname = Unique_Rowname,
 seed = 50, prediction.type="OOB", MODELpredfn = MODELfn,
na.action = "na.omit",  device.type = "jpeg",
res=300, jpeg.res = 300, device.width = 4000, device.height = 4000, units="px",
pointsize=18, cex=1.5)
print('Model Diagnostics FINISHED')
 #qdata.testfn = qtestfn,
model.mapmake( model.obj=model.obj ,folder=Working_Folder, MODELfn=MODELfn, rastLUTfn=rastLUT, na.action="na.omit",map.sd=TRUE)
print('FINISHED')

